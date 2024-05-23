import {
  Arg,
  Mutation,
  Query,
  Resolver,
  ID,
  Authorized,
  Ctx,
} from 'type-graphql'
import { validate } from 'class-validator'
import {
  SubCategory,
  SubCategoryCreateInput,
  SubCategoryUpdateInput,
} from '../entities/SubCategory'
import { MyContext } from '../types/Users.types'
import { Picture } from '../entities/Picture'

@Resolver(SubCategory)
export class SubCategoriesResolver {
  // CREATE
  @Authorized('ADMIN')
  @Mutation(() => SubCategory)
  async subCategoryCreate(
    @Arg('data', () => SubCategoryCreateInput) data: SubCategoryCreateInput,
    @Ctx() context: MyContext
  ): Promise<SubCategory> {
    // Check if user is authenticated
    if (!context.user) {
      throw new Error('User context is missing or user is not authenticated')
    }

    // Create new SubCategory
    const newSubCategory = new SubCategory()
    // Assign data to new SubCategory
    Object.assign(newSubCategory, data)
    newSubCategory.createdBy = context.user

    // Assign Picture if pictureId is provided
    if (data.pictureId) {
      const picture = await Picture.findOne({ where: { id: data.pictureId } })
      if (!picture) {
        throw new Error('Picture not found')
      }
      newSubCategory.picture = picture
    }

    // Check if SubCategory name is already in use
    const subCategoryName: string = data.name
    const existingSubCategory = await SubCategory.findOne({
      where: { name: subCategoryName },
    })
    if (existingSubCategory) {
      throw new Error(`SubCategory name already in use`)
    }

    // Validate and save new SubCategory
    const errors = await validate(newSubCategory)
    if (errors.length === 0) {
      await newSubCategory.save()
      return newSubCategory
    } else {
      throw new Error(`Error occured: ${JSON.stringify(errors)}`)
    }
  }

  // UPDATE
  @Authorized('ADMIN')
  @Mutation(() => SubCategory, { nullable: true })
  async subCategoryUpdate(
    @Arg('id', () => ID) id: number,
    @Arg('data') data: SubCategoryUpdateInput,
    @Ctx() context: MyContext
  ): Promise<SubCategory | null> {
    // Check if user is authenticated
    if (!context.user) {
      throw new Error('User context is missing or user is not authenticated')
    }
    // Check if SubCategory exists
    const updatedSubCategory = await SubCategory.findOne({
      where: { id },
      relations: { picture: true, createdBy: true, updatedBy: true },
    })
    // If SubCategory not found, throw error
    if (!updatedSubCategory) {
      throw new Error('SubCategory not found')
    }
    // Update SubCategory with new data
    Object.assign(updatedSubCategory, data)
    updatedSubCategory.updatedBy = context.user

    // Update Picture if new pictureId is provided
    if (data.pictureId !== updatedSubCategory.picture?.id) {
      const picture = await Picture.findOne({ where: { id: data.pictureId } })
      if (!picture) {
        throw new Error('Picture not found')
      }
      updatedSubCategory.picture = picture
    }

    // Validate and save updated SubCategory
    const errors = await validate(updatedSubCategory)
    if (errors.length === 0) {
      await updatedSubCategory.save()
    }
    return updatedSubCategory
  }

  // GET ALL
  @Query(() => [SubCategory])
  async subCategoriesGetAll(): Promise<SubCategory[]> {
    const subCategories = await SubCategory.find({
      relations: {
        ads: { picture: true },
        category: true,
        picture: true,
        createdBy: true,
        updatedBy: true,
      },
      order: { name: 'ASC' },
    })
    return subCategories
  }

  // GET BY ID
  @Query(() => SubCategory)
  async subCategoryById(@Arg('id', () => ID) id: number): Promise<SubCategory> {
    const subCategory = await SubCategory.findOne({
      where: { id },
      relations: {
        ads: { tags: true, user: { picture: true }, picture: true },
        category: true,
        picture: true,
        createdBy: true,
        updatedBy: true,
      },
      order: {
        ads: {
          updatedAt: 'DESC',
        },
      },
    })
    if (!subCategory) {
      throw new Error('SubCategory not found')
    }

    return subCategory
  }

  // DELETE
  @Authorized('ADMIN')
  @Mutation(() => SubCategory, { nullable: true })
  async subCategoryDelete(
    @Arg('id', () => ID) id: number
  ): Promise<SubCategory | null> {
    const subCategory = await SubCategory.findOne({
      where: { id },
      relations: { ads: { picture: true } },
    })
    if (subCategory) {
      await subCategory.remove()
      subCategory.id = id
    }
    return subCategory
  }
}
