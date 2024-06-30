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
import { CategoriesServices } from '../services/Categories.services'
import { IsNull } from 'typeorm'
import { deletePicture } from '../utils/picturesServices/deletePicture'

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

    // Check if Category name is already used in parent Category or among root categories
    await CategoriesServices.existingCategory(
      data.name,
      data.parentCategory?.id
    )

    // Create new Category
    const newCategory = new Category()

    // Assign data to new Category
    Object.assign(newCategory, data)
    newCategory.createdBy = context.user
    newCategory.updatedBy = context.user

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
      relations: { childCategories: true, createdBy: true },
    })

    // If Category not found, throw error
    if (!category) {
      throw new Error('Category not found')
    }

    if (data.picture !== category.picture) {
      await deletePicture(category.picture)
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
  @Authorized('ADMIN')
  @Query(() => [Category])
  async categoriesGetAll(): Promise<Category[]> {
    const categories = await Category.find({
      relations: {
        parentCategory: true,
        childCategories: { ads: true },
        createdBy: true,
        updatedBy: true,
      },
      order: { id: 'ASC' },
    })
    return categories
  }

  // GET ALL ROOT
  @Query(() => [Category])
  async categoriesGetaLLRoot(): Promise<Category[]> {
    const rootCategories = await Category.find({
      where: { parentCategory: IsNull(), display: true },
      relations: {
        ads: true,
        createdBy: true,
        updatedBy: true,
      },
      order: { id: 'ASC' },
    })
    return rootCategories
  }

  // GET ALL WITH FULL HIERARCHY
  @Query(() => [Category])
  async categoriesGetAllWithHierarchy(): Promise<Category[]> {
    // Fetch all root categories with their full hierarchy
    const rootCategories = await Category.find({
      where: { parentCategory: IsNull(), display: true },
      relations: {
        childCategories: {
          childCategories: true,
        },
      },
      order: { id: 'ASC' },
    })

    return rootCategories
  }

  // GET BY ID
  @Query(() => Category)
  async categoryById(@Arg('id', () => ID) id: number): Promise<Category> {
    const category = await Category.findOne({
      where: { id },
      relations: {
        parentCategory: { parentCategory: true },
        childCategories: { ads: true, childCategories: true },
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
      relations: { childCategories: true },
    })
    if (category) {
      if (category.picture) {
        await deletePicture(category.picture)
      }
      await category.remove()
      category.id = id
    }
    return category
  }
}
