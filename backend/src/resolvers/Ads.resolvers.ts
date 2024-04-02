import {
  Arg,
  Query,
  Resolver,
  Mutation,
  ID,
  Int,
  Ctx,
  Authorized,
} from 'type-graphql'
import { In, MoreThanOrEqual, LessThanOrEqual, Between, ILike } from 'typeorm'
import { validate } from 'class-validator'
import { Ad, AdCreateInput, AdUpdateInput, AdsWhere } from '../entities/Ad'
import { deletePicture } from '../utils/pictureServices/pictureServices'
import { merge } from '../utils/utils'
import { MyContext } from '../types/Users.types'
import { Picture } from '../entities/Picture'
import { getDistanceFromLatLonInKm } from '../utils/gpsDistance'
import { AdsQueryWhere } from '../types/Ads.types'

@Resolver(Ad)
export class AdsResolver {
  // CREATE
  @Authorized('ADMIN', 'USER')
  @Mutation(() => Ad)
  async adCreate(
    @Ctx() context: MyContext,
    @Arg('data', () => AdCreateInput) data: AdCreateInput
  ): Promise<Ad> {
    if (!context.user) {
      throw new Error('User context is missing or user is not authenticated')
    }

    const newAd = new Ad()
    Object.assign(newAd, data, { user: context.user })
    newAd.createdBy = context.user
    newAd.updatedBy = context.user

    if (data.pictureId) {
      const picture = await Picture.findOne({ where: { id: data.pictureId } })
      if (!picture) {
        throw new Error('Picture not found')
      }
      newAd.picture = picture
    }

    const errors = await validate(newAd)
    if (errors.length === 0) {
      await newAd.save()
      return newAd
    }
    throw new Error(`Error occurred: ${JSON.stringify(errors)}`)
  }

  // UPDATE
  @Authorized('ADMIN', 'USER')
  @Mutation(() => Ad, { nullable: true })
  async AdUpdate(
    @Ctx() context: MyContext,
    @Arg('id', () => ID) id: number,
    @Arg('data') data: AdUpdateInput
  ): Promise<Ad | null> {
    // Check if user is authenticated
    if (!context.user) {
      throw new Error('User context is missing or user is not authenticated')
    }
    // Get ad by id
    const ad = await Ad.findOne({
      where: { id },
      relations: { tags: true, user: true, picture: true },
    })
    if (
      ad &&
      (ad.user.id === context.user?.id || context.user?.role === 'ADMIN')
    ) {
      let oldPictureId = null
      if (data.pictureId && ad.picture?.id) {
        oldPictureId = ad.picture.id
        const newPicture = await Picture.findOne({
          where: { id: data.pictureId },
        })
        if (!newPicture) {
          throw new Error('New picture not found')
        }
        ad.picture = newPicture
      }

      merge(ad, data)

      const errors = await validate(ad)
      if (errors.length === 0) {
        await Ad.save(ad)
        if (oldPictureId) {
          await deletePicture(oldPictureId)
        }

        return await Ad.findOne({
          where: { id },
          relations: {
            subCategory: true,
            tags: true,
            picture: true,
            user: { picture: true },
          },
        })
      }
    } else {
      throw new Error(`Error occured: ${JSON.stringify(Error)}`)
    }
    return ad
  }

  // GET ALL
  @Query(() => [Ad], { nullable: true })
  async adsGetAll(
    @Arg('where', { nullable: true }) where?: AdsWhere,
    @Arg('take', () => Int, { nullable: true }) take?: number,
    @Arg('skip', () => Int, { nullable: true }) skip?: number
  ): Promise<Ad[] | null> {
    try {
      const queryWhere: AdsQueryWhere = {}

      if (where?.subCategory) {
        queryWhere.subCategory = In(where.subCategory)
      }

      if (where?.title) {
        queryWhere.title = ILike(`%${where.title}%`)
      }

      if (where?.minPrice && where?.maxPrice) {
        queryWhere.price = Between(
          Number(where.minPrice),
          Number(where.maxPrice)
        )
      } else {
        if (where?.minPrice) {
          queryWhere.price = MoreThanOrEqual(Number(where.minPrice))
        }

        if (where?.maxPrice) {
          queryWhere.price = LessThanOrEqual(Number(where.maxPrice))
        }
      }

      let ads = await Ad.find({
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
          updatedAt: 'DESC',
        },
      })
      if (where?.tags) {
        const tagIds = where.tags.map((tag) => Number(tag))
        ads = ads.filter((ad) => ad.tags.some((tag) => tagIds.includes(tag.id)))
      }
      if (where?.location && where.radius !== undefined) {
        const { latitude, longitude } = where.location
        const { radius } = where
        ads = ads.filter((ad) => {
          if (!ad.coordinates || ad.coordinates.length !== 2) {
            return false
          }

          const [adLat, adLon] = ad.coordinates
          const distance = getDistanceFromLatLonInKm(
            latitude,
            longitude,
            adLat,
            adLon
          )
          return distance <= radius
        })
      }

      return ads
    } catch (errors) {
      throw new Error(`Error occured: ${JSON.stringify(errors)}`)
    }
  }

  // GET BY ID
  @Query(() => Ad)
  async adById(@Arg('id', () => ID) id: number): Promise<Ad> {
    const ad = await Ad.findOne({
      where: { id },
      relations: {
        subCategory: { category: true },
        tags: true,
        user: { picture: true },
        picture: true,
      },
    })
    if (!ad) {
      throw new Error('Ad not found')
    }
    return ad
  }

  // GET BY USER
  @Query(() => [Ad])
  async adsByUser(@Arg('id', () => ID) id: number): Promise<Ad[]> {
    const ads = await Ad.find({
      where: { user: { id } },
      relations: { user: true, subCategory: true, tags: true, picture: true },
    })

    if (ads.length === 0) {
      throw new Error('No ads found for this user')
    }

    return ads
  }

  // DELETE
  @Authorized('ADMIN', 'USER')
  @Mutation(() => Ad, { nullable: true })
  async adDelete(
    @Ctx() context: MyContext,
    @Arg('id', () => ID) id: number
  ): Promise<Ad | null> {
    const ad = await Ad.findOne({
      where: { id },
      relations: { user: true, picture: true },
    })
    if (
      ad &&
      (ad.user.id === context.user?.id || context.user?.role === 'ADMIN')
    ) {
      const pictureId = ad.picture?.id
      await ad.remove()
      if (pictureId) {
        await deletePicture(pictureId)
      }
      ad.id = id
    }
    return ad
  }
}
