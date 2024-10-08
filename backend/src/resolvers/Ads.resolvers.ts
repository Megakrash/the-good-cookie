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
import { validate } from 'class-validator'
import { Ad, AdCreateInput, AdUpdateInput, AdsWhere } from '../entities/Ad'
import { merge } from '../utils/utils'
import { MyContext } from '../types/Users.types'
import { deletePicture } from '../utils/picturesServices/deletePicture'

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

    const errors = await validate(newAd)
    if (errors.length === 0) {
      await newAd.save()
      return newAd
    }
    // If there are validation errors delete the user info in the error message
    const validationErrors = errors.map((err) => ({
      property: err.property,
      constraints: err.constraints,
    }))

    throw new Error(`Error occurred: ${JSON.stringify(validationErrors)}`)
  }

  // UPDATE
  @Authorized('ADMIN', 'USER')
  @Mutation(() => Ad, { nullable: true })
  async AdUpdate(
    @Ctx() context: MyContext,
    @Arg('id', () => ID) id: string,
    @Arg('data') data: AdUpdateInput
  ): Promise<Ad | null> {
    // Check if user is authenticated
    if (!context.user) {
      throw new Error('User context is missing or user is not authenticated')
    }
    // Get ad by id
    const ad = await Ad.findOne({
      where: { id },
      relations: { tags: true, user: true },
    })
    if (
      ad &&
      (ad.user.id === context.user?.id || context.user?.role === 'ADMIN')
    ) {
      if (data.picture) {
        await deletePicture(ad.picture)
      }
      merge(ad, data)

      const errors = await validate(ad)
      if (errors.length === 0) {
        await Ad.save(ad)

        return await Ad.findOne({
          where: { id },
          relations: {
            category: true,
            tags: true,
            user: true,
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
    @Arg('where', () => AdsWhere, { nullable: true }) where?: AdsWhere,
    @Arg('take', () => Int, { nullable: true }) take?: number,
    @Arg('skip', () => Int, { nullable: true }) skip?: number
  ): Promise<Ad[] | null> {
    try {
      // Create a query builder
      const query = Ad.createQueryBuilder('ad')

      // Join relations with unique aliases
      query.leftJoinAndSelect('ad.category', 'category')
      query.leftJoinAndSelect('category.parentCategory', 'parentCategory')
      query.leftJoinAndSelect('ad.user', 'user')
      query.leftJoinAndSelect('ad.tags', 'tags')

      // Filter by subCategory
      if (where?.category) {
        query.andWhere('ad.category IN (:...category)', {
          category: where.category,
        })
      }

      //  Filter by title
      if (where?.title) {
        query.andWhere('ad.title ILIKE :title', { title: `%${where.title}%` })
      }

      // Filter by price
      if (where?.minPrice && where?.maxPrice) {
        query.andWhere('ad.price BETWEEN :minPrice AND :maxPrice', {
          minPrice: where.minPrice,
          maxPrice: where.maxPrice,
        })
      } else {
        if (where?.minPrice) {
          query.andWhere('ad.price >= :minPrice', { minPrice: where.minPrice })
        }
        if (where?.maxPrice) {
          query.andWhere('ad.price <= :maxPrice', { maxPrice: where.maxPrice })
        }
      }

      // Filter by location
      if (where?.location && where.radius !== undefined) {
        query.andWhere(
          `ST_DWithin(
            geography(ad.location),
            geography(ST_SetSRID(ST_MakePoint(:longitude, :latitude), 4326)),
            :radius
        )`,
          {
            longitude: where.location.coordinates[0],
            latitude: where.location.coordinates[1],
            radius: where.radius * 1000,
          }
        )
      }

      // Pagination & order
      query.take(take ?? 50).skip(skip ?? 0)
      query.orderBy('ad.updatedAt', 'DESC')

      // Execute the query
      const ads = await query.getMany()

      return ads
    } catch (errors) {
      throw new Error(`Error occured: ${JSON.stringify(errors)}`)
    }
  }

  // GET BY ID
  @Query(() => Ad)
  async adById(@Arg('id', () => ID) id: string): Promise<Ad> {
    const ad = await Ad.findOne({
      where: { id },
      relations: {
        category: { parentCategory: { parentCategory: true } },
        tags: true,
        user: true,
      },
    })
    if (!ad) {
      throw new Error('Ad not found')
    }
    return ad
  }

  // GET BY USER
  @Query(() => [Ad])
  async adsByUser(@Arg('id', () => ID) id: string): Promise<Ad[]> {
    const ads = await Ad.find({
      where: { user: { id } },
      relations: { user: true, category: true, tags: true },
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
    @Arg('id', () => ID) id: string
  ): Promise<Ad | null> {
    const ad = await Ad.findOne({
      where: { id },
      relations: { user: true },
    })
    if (
      ad &&
      (ad.user.id === context.user?.id || context.user?.role === 'ADMIN')
    ) {
      await ad.remove()
      await deletePicture(ad.picture)
      ad.id = id
    }
    return ad
  }
}
