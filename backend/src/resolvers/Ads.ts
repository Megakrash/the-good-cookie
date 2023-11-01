import { Arg, Query, Resolver, Mutation, ID } from "type-graphql";
import { In, Like, MoreThanOrEqual, LessThanOrEqual } from "typeorm";
import { Ad, AdCreateInput, AdUpdateInput, AdsWhere } from "../entities/Ad";
import { validate } from "class-validator";
import { currentDate } from "../utils/date";

@Resolver(Ad)
export class AdsResolver {
  @Query(() => [Ad])
  async adsGetAll(
    @Arg("where", { nullable: true }) where?: AdsWhere
  ): Promise<Ad[]> {
    const queryWhere: any = {};

    if (where?.subCategory) {
      queryWhere.subCategory = { id: In(where.subCategory) };
    }

    if (where?.title) {
      queryWhere.title = Like(`%${where.title}%`);
    }

    if (where?.minPrice) {
      queryWhere.price = MoreThanOrEqual(Number(where.minPrice));
    }

    if (where?.maxPrice) {
      queryWhere.price = LessThanOrEqual(Number(where.maxPrice));
    }

    if (where?.location) {
      queryWhere.location = Like(`%${where.location}%`);
    }

    const ads = await Ad.find({
      where: queryWhere,
      relations: {
        subCategory: {
          category: true,
        },
        tags: true,
        user: true,
      },
    });
    return ads;
  }

  @Query(() => Ad)
  async adById(@Arg("id") id: number): Promise<Ad> {
    const ad = await Ad.findOne({
      where: { id },
      relations: { subCategory: true, tags: true, user: true },
    });
    if (!ad) {
      throw new Error("Ad not found");
    }
    return ad;
  }

  @Mutation(() => Ad)
  async adCreate(
    @Arg("data", () => AdCreateInput) data: AdCreateInput
  ): Promise<Ad> {
    const date: Date = new Date();
    const createdDate = currentDate();
    const updateDate = currentDate();
    const newAd = new Ad();
    Object.assign(newAd, data, { createdDate }, { updateDate });

    const errors = await validate(newAd);
    if (errors.length === 0) {
      await newAd.save();
      return newAd;
    } else {
      throw new Error(`Error occured: ${JSON.stringify(errors)}`);
    }
  }

  @Mutation(() => Ad, { nullable: true })
  async AdUpdate(
    @Arg("id", () => ID) id: number,
    @Arg("data") data: AdUpdateInput
  ): Promise<Ad | null> {
    const ad = await Ad.findOne({
      where: { id: id },
      relations: { tags: true },
    });

    if (ad) {
      if (data.tags) {
        data.tags = data.tags.map((entry) => {
          const existingRelation = ad.tags.find(
            (tag) => tag.id === Number(entry.id)
          );
          return existingRelation || entry;
        });
      }
      const updateDate = currentDate();
      Object.assign(ad, data, { updateDate });

      const errors = await validate(ad);
      if (errors.length === 0) {
        await Ad.save(ad);
        return await Ad.findOne({
          where: { id: id },
          relations: {
            subCategory: true,
            tags: true,
          },
        });
      } else {
        throw new Error(`Error occured: ${JSON.stringify(errors)}`);
      }
    }
    return ad;
  }

  @Mutation(() => Ad, { nullable: true })
  async adDelete(@Arg("id", () => ID) id: number): Promise<Ad | null> {
    const ad = await Ad.findOne({
      where: { id: id },
    });
    if (ad) {
      await ad.remove();
      ad.id = id;
    }
    return ad;
  }
}
