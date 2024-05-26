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
    // Check if user is authenticated
    if (!context.user) {
      throw new Error('User context is missing or user is not authenticated')
    }

    // Create new Category
    const newCategory = new Category()

    // Assign data to new Category
    Object.assign(newCategory, data)
    newCategory.createdBy = context.user
    newCategory.updatedBy = context.user

    // Check if Category name is already in use
    const categoryName: string = data.name
    const existingCategory = await Category.findOne({
      where: { name: categoryName },
    })
    if (existingCategory) {
      throw new Error(`Category name already in use`)
    }

    // Validate and save new Category
    const errors = await validate(newCategory)
    if (errors.length === 0) {
      await newCategory.save()
      return newCategory
    }
    throw new Error(`Error occured: ${JSON.stringify(errors)}`)
  }

  // UPDATE
  @Authorized('ADMIN')
  @Mutation(() => Category, { nullable: true })
  async categoryUpdate(
    @Arg('id', () => ID) id: number,
    @Arg('data') data: CategoryUpdateInput,
    @Ctx() context: MyContext
  ): Promise<Category | null> {
    // Check if user is authenticated
    if (!context.user) {
      throw new Error('User context is missing or user is not authenticated')
    }

    // Find Category by ID
    const category = await Category.findOne({
      where: { id },
      relations: { subCategories: true, createdBy: true },
    })

    // If Category not found, throw error
    if (!category) {
      throw new Error('Category not found')
    }

    // Update Category with new data
    Object.assign(category, data)
    category.updatedBy = context.user

    // Validate and save updated Category
    const errors = await validate(category)
    if (errors.length === 0) {
      await category.save()
    } else {
      throw new Error(`Error occured: ${JSON.stringify(errors)}`)
    }

    return category
  }

  // GET ALL
  @Query(() => [Category])
  async categoriesGetAll(): Promise<Category[]> {
    const categories = await Category.find({
      relations: {
        subCategories: { ads: true },
        createdBy: true,
        updatedBy: true,
      },
      order: { id: 'ASC' },
    })
    return categories
  }

  // GET BY ID
  @Query(() => Category)
  async categoryById(@Arg('id', () => ID) id: number): Promise<Category> {
    const category = await Category.findOne({
      where: { id },
      relations: {
        subCategories: { ads: true, picture: true },
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
