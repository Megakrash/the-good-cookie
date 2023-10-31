import { Arg, Query, Resolver } from "type-graphql";
import { Ad } from "../entities/Ad";

@Resolver(Ad)
export class AdsResolver {
  @Query(() => [Ad])
  async adsGetAll(): Promise<Ad[]> {
    const ads = await Ad.find({
      relations: { subCategory: true, tags: true, user: true },
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
}
