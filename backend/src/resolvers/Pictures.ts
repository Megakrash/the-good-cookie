import { Resolver, Mutation, Arg } from "type-graphql";
import { Picture, PictureCreateInput } from "../entities/Picture";
import { createImage } from "../picture/createPicture";

@Resolver(Picture)
export class PictureResolver {
  @Mutation(() => Picture)
  async createPicture(
    @Arg("data", () => PictureCreateInput) data: PictureCreateInput
  ): Promise<Picture> {
    return createImage(data.filename);
  }
}
