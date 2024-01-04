import { Picture } from "../entities/Picture";

export async function createImage(filename: string): Promise<Picture> {
  const picture = new Picture();
  picture.filename = filename;
  await picture.save();
  return picture;
}
