import { Arg, Query, Resolver, Mutation, ID } from "type-graphql";
import { In, MoreThanOrEqual, LessThanOrEqual, Between, ILike } from "typeorm";
import { Ad, AdCreateInput, AdUpdateInput, AdsWhere } from "../entities/Ad";
import { validate } from "class-validator";
import { currentDate } from "../utils/date";
import { merge } from "../utils/utils";
import fs from "fs";

@Resolver(Ad)
export class AdsResolver {
  @Query(() => [Ad], { nullable: true })
  async adsGetAll(
    @Arg("where", { nullable: true }) where?: AdsWhere
  ): Promise<Ad[] | null> {
    try {
      const queryWhere: any = {};

      if (where?.subCategory) {
        queryWhere.subCategory = { id: In(where.subCategory) };
      }

      if (where?.title) {
        queryWhere.title = ILike(`%${where.title}%`);
      }

      if (where?.minPrice && where?.maxPrice) {
        queryWhere.price = Between(
          Number(where.minPrice),
          Number(where.maxPrice)
        );
      } else {
        if (where?.minPrice) {
          queryWhere.price = MoreThanOrEqual(Number(where.minPrice));
        }

        if (where?.maxPrice) {
          queryWhere.price = LessThanOrEqual(Number(where.maxPrice));
        }
      }

      if (where?.location) {
        queryWhere.location = ILike(`%${where.location}%`);
      }

      if (where?.tags) {
        queryWhere.tags = { id: In(where.tags) };
      }
      if (where?.createdDate) {
        queryWhere.date = MoreThanOrEqual(where.createdDate);
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
        order: {
          updateDate: "DESC",
        },
      });
      return ads;
    } catch (errors) {
      throw new Error(`Error occured: ${JSON.stringify(errors)}`);
    }
  }

  @Query(() => Ad)
  async adById(@Arg("id", () => ID) id: number): Promise<Ad> {
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
      if ("picture" in data && data.picture === "" && ad.picture) {
        const filePath = `./public/assets/images/ads/${ad.picture}`;
        try {
          fs.unlink(filePath, (err: NodeJS.ErrnoException | null) => {
            if (err) {
              console.error(`Error deleting image: ${err}`);
            }
          });
        } catch (err) {
          console.error(`Error deleting image: ${err}`);
        }
        ad.picture = "";
      }

      const updateDate = currentDate();
      const dataWithUpdateDate = { ...data, updateDate };
      merge(ad, dataWithUpdateDate);

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
