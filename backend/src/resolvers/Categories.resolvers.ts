import {
  Arg,
  Query,
  Resolver,
  Mutation,
  ID,
  Authorized,
  Ctx,
} from 'type-graphql'
import { validate } from 'class-validator'
import {
  Category,
  CategoryCreateInput,
  CategoryUpdateInput,
} from '../entities/Category'
import { MyContext } from '../types/Users.types'

@Resolver(Category)
export class CategoriesResolver {
  // CREATE
  @Authorized('ADMIN')
  @Mutation(() => Category)
  async categoryCreate(
    @Arg('data', () => CategoryCreateInput) data: CategoryCreateInput,
    @Ctx() context: MyContext
  ): Promise<Category> {
    if (!context.user) {
      throw new Error('User context is missing or user is not authenticated')
    }
    const newCategory = new Category()
    Object.assign(newCategory, data)

    newCategory.createdBy = context.user
    newCategory.updatedBy = context.user

    const categoryName: string = data.name
    const existingCategory = await Category.findOne({
      where: { name: categoryName },
    })

    if (existingCategory) {
      throw new Error(`Category name "${categoryName}" already in use`)
    } else {
      const errors = await validate(newCategory)
      if (errors.length === 0) {
        await newCategory.save()
        return newCategory
      }
      throw new Error(`Error occured: ${JSON.stringify(errors)}`)
    }
  }

  // UPDATE
  @Authorized('ADMIN')
  @Mutation(() => Category, { nullable: true })
  async categoryUpdate(
    @Arg('id', () => ID) id: number,
    @Arg('data') data: CategoryUpdateInput,
    @Ctx() context: MyContext
  ): Promise<Category | null> {
    if (!context.user) {
      throw new Error('User context is missing or user is not authenticated')
    }
    const category = await Category.findOne({
      where: { id },
    })

    if (category) {
      Object.assign(category, data)
      category.updatedBy = context.user
      const errors = await validate(category)
      if (errors.length === 0) {
        await category.save()
      } else {
        throw new Error(`Error occured: ${JSON.stringify(errors)}`)
      }
    }

    return category
  }

  // READ ALL
  @Query(() => [Category])
  async categoriesGetAll(): Promise<Category[]> {
    const categories = await Category.find({
      relations: {
        subCategories: { ads: true },
        createdBy: true,
        updatedBy: true,
      },
      order: { name: 'ASC' },
    })
    return categories
  }

  // READ BY ID
  @Query(() => Category)
  async categoryById(@Arg('id', () => ID) id: number): Promise<Category> {
    const category = await Category.findOne({
      where: { id },
      relations: {
        subCategories: { ads: true },
        createdBy: true,
        updatedBy: true,
      },
    })
    if (!category) {
      throw new Error('Category not found')
    }
    return category
  }

  // DELETE
  @Authorized('ADMIN')
  @Mutation(() => Category, { nullable: true })
  async categoryDelete(
    @Arg('id', () => ID) id: number
  ): Promise<Category | null> {
    const category = await Category.findOne({
      where: { id },
      relations: { subCategories: true },
    })
    if (category) {
      await category.remove()
      category.id = id
    }
    return category
  }
}
