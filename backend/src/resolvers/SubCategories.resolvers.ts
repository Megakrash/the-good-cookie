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

@Resolver(SubCategory)
export class SubCategoriesResolver {
  // CREATE
  @Authorized('ADMIN')
  @Mutation(() => SubCategory)
  async subCategoryCreate(
    @Arg('data', () => SubCategoryCreateInput) data: SubCategoryCreateInput,
    @Ctx() context: MyContext
  ): Promise<SubCategory> {
    if (!context.user) {
      throw new Error('User context is missing or user is not authenticated')
    }
    const newSubCategory = new SubCategory()
    Object.assign(newSubCategory, data)
    newSubCategory.createdBy = context.user
    const subCategoryName: string = data.name
    const existingSubCategory = await SubCategory.findOne({
      where: { name: subCategoryName },
    })

    if (existingSubCategory) {
      throw new Error(`SubCategory name "${subCategoryName}" already in use`)
    } else {
      const errors = await validate(newSubCategory)
      if (errors.length === 0) {
        await newSubCategory.save()
        return newSubCategory
      }
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
    if (!context.user) {
      throw new Error('User context is missing or user is not authenticated')
    }
    const updatedSubCategory = await SubCategory.findOne({
      where: { id },
    })
    if (updatedSubCategory) {
      Object.assign(updatedSubCategory, data)
      updatedSubCategory.updatedBy = context.user
      const errors = await validate(updatedSubCategory)
      if (errors.length === 0) {
        await updatedSubCategory.save()
      } else {
        throw new Error(`Error occured: ${JSON.stringify(errors)}`)
      }
    }
    return updatedSubCategory
  }

  // READ ALL
  @Query(() => [SubCategory])
  async subCategoriesGetAll(): Promise<SubCategory[]> {
    const subCategories = await SubCategory.find({
      relations: { ads: { picture: true }, category: true },
      order: { name: 'ASC' },
    })
    return subCategories
  }

  // READ BY ID
  @Query(() => SubCategory)
  async subCategoryById(@Arg('id', () => ID) id: number): Promise<SubCategory> {
    const subCategory = await SubCategory.findOne({
      where: { id },
      relations: {
        ads: { tags: true, user: { picture: true }, picture: true },
        category: true,
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
