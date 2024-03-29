import { Arg, Mutation, Query, Resolver, ID, Authorized } from 'type-graphql'
import { validate } from 'class-validator'
import {
  SubCategory,
  SubCategoryCreateInput,
  SubCategoryUpdateInput,
} from '../entities/SubCategory'

@Resolver(SubCategory)
export class SubCategoriesResolver {
  @Query(() => [SubCategory])
  async subCategoriesGetAll(): Promise<SubCategory[]> {
    const subCategories = await SubCategory.find({
      relations: { ads: { picture: true }, category: true },
      order: { name: 'ASC' },
    })
    return subCategories
  }

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
          updateDate: 'DESC',
        },
      },
    })
    if (!subCategory) {
      throw new Error('SubCategory not found')
    }

    return subCategory
  }

  @Authorized('ADMIN')
  @Mutation(() => SubCategory)
  async subCategoryCreate(
    @Arg('data', () => SubCategoryCreateInput) data: SubCategoryCreateInput
  ): Promise<SubCategory> {
    const newSubCategory = new SubCategory()
    Object.assign(newSubCategory, data)
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

  @Authorized('ADMIN')
  @Mutation(() => SubCategory, { nullable: true })
  async subCategoryUpdate(
    @Arg('id', () => ID) id: number,
    @Arg('data') data: SubCategoryUpdateInput
  ): Promise<SubCategory | null> {
    const updatedSubCategory = await SubCategory.findOne({
      where: { id },
    })
    if (updatedSubCategory) {
      Object.assign(updatedSubCategory, data)

      const errors = await validate(updatedSubCategory)
      if (errors.length === 0) {
        await updatedSubCategory.save()
      } else {
        throw new Error(`Error occured: ${JSON.stringify(errors)}`)
      }
    }
    return updatedSubCategory
  }

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
