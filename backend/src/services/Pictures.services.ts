import { Picture } from '../entities/Picture'

export class PicturesServices {
  // Find picture by id
  static async findPictureById(id: number): Promise<Picture | null> {
    const picture = await Picture.findOne({ where: { id } })
    if (!picture) {
      throw new Error('Picture not found')
    }
    return picture
  }
}
