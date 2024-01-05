import {
  Arg,
  Query,
  Resolver,
  Mutation,
  ID,
  Int,
  Ctx,
  Authorized,
} from "type-graphql";
import { In, MoreThanOrEqual, LessThanOrEqual, Between, ILike } from "typeorm";
import { Ad, AdCreateInput, AdUpdateInput, AdsWhere } from "../entities/Ad";
import { validate } from "class-validator";
import { currentDate } from "../utils/date";
import { merge } from "../utils/utils";
import fs from "fs";
import { MyContext } from "../index";
import { Picture } from "../entities/Picture";

@Resolver(Ad)
export class AdsResolver {
  @Query(() => [Ad], { nullable: true })
  async adsGetAll(
    @Arg("where", { nullable: true }) where?: AdsWhere,
    @Arg("take", () => Int, { nullable: true }) take?: number,
    @Arg("skip", () => Int, { nullable: true }) skip?: number
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

      if (where?.city) {
        queryWhere.city = ILike(`%${where.city}%`);
      }

      if (where?.tags) {
        queryWhere.tags = { id: In(where.tags) };
      }
      if (where?.createdDate) {
        queryWhere.date = MoreThanOrEqual(where.createdDate);
      }

      const ads = await Ad.find({
        take: take ?? 50,
        skip,
        where: queryWhere,
        relations: {
          subCategory: {
            category: true,
          },
          tags: true,
          user: { picture: true },
          picture: true,
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
      relations: {
        subCategory: { category: true },
        tags: true,
        user: { picture: true },
        picture: true,
      },
    });
    if (!ad) {
      throw new Error("Ad not found");
    }
    return ad;
  }

  @Query(() => [Ad])
  async adsByUser(@Arg("id", () => ID) id: number): Promise<Ad[]> {
    const ads = await Ad.find({
      where: { user: { id } },
      relations: { user: true, subCategory: true, tags: true, picture: true },
    });

    if (ads.length === 0) {
      throw new Error("No ads found for this user");
    }

    return ads;
  }

  @Authorized("ADMIN", "USER")
  @Mutation(() => Ad)
  async adCreate(
    @Ctx() context: MyContext,
    @Arg("data", () => AdCreateInput) data: AdCreateInput
  ): Promise<Ad> {
    const createdDate = currentDate();
    const updateDate = currentDate();
    const newAd = new Ad();
    Object.assign(
      newAd,
      data,
      { user: context.user },
      { createdDate },
      { updateDate }
    );

    if (data.pictureId) {
      const picture = await Picture.findOne({ where: { id: data.pictureId } });
      if (!picture) {
        throw new Error("Picture not found");
      }
      newAd.picture = picture;
    }

    const errors = await validate(newAd);
    if (errors.length === 0) {
      await newAd.save();
      return newAd;
    } else {
      throw new Error(`Error occurred: ${JSON.stringify(errors)}`);
    }
  }
  @Authorized("ADMIN", "USER")
  @Mutation(() => Ad, { nullable: true })
  async AdUpdate(
    @Ctx() context: MyContext,
    @Arg("id", () => ID) id: number,
    @Arg("data") data: AdUpdateInput
  ): Promise<Ad | null> {
    const ad = await Ad.findOne({
      where: { id: id },
      relations: { tags: true, user: true, picture: true },
    });
    if (ad && ad.user.id === context.user?.id) {
      if (
        "pictureId" in data &&
        data.pictureId === null &&
        ad.picture?.filename
      ) {
        try {
          await Picture.delete({ id: ad.picture.id });
          const filePath = `./public/assets/images/ads/${ad.picture.filename}`;

          fs.unlink(filePath, (err: NodeJS.ErrnoException | null) => {
            if (err) {
              console.error(`Error deleting image: ${err}`);
            }
          });
        } catch (err) {
          console.error(`Error deleting image: ${err}`);
        }
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
            picture: true,
          },
        });
      } else {
        throw new Error(`Error occured: ${JSON.stringify(errors)}`);
      }
    }
    return ad;
  }

  @Authorized("ADMIN", "USER")
  @Mutation(() => Ad, { nullable: true })
  async adDelete(
    @Ctx() context: MyContext,
    @Arg("id", () => ID) id: number
  ): Promise<Ad | null> {
    const ad = await Ad.findOne({
      where: { id: id },
      relations: { user: true },
    });
    if (ad && ad.user.id === context.user?.id) {
      await ad.remove();
      ad.id = id;
    }
    return ad;
  }
}
