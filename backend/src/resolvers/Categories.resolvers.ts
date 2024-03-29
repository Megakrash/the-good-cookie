import { Arg, Query, Resolver, Mutation, ID, Authorized } from 'type-graphql'
import { validate } from 'class-validator'
import {
  Category,
  CategoryCreateInput,
  CategoryUpdateInput,
} from '../entities/Category'

@Resolver(Category)
export class CategoriesResolver {
  @Query(() => [Category])
  async categoriesGetAll(): Promise<Category[]> {
    const categories = await Category.find({
      relations: { subCategories: { ads: true } },
      order: { name: 'ASC' },
    })
    return categories
  }

  @Query(() => Category)
  async categoryById(@Arg('id', () => ID) id: number): Promise<Category> {
    const category = await Category.findOne({
      where: { id },
      relations: { subCategories: { ads: true } },
    })
    if (!category) {
      throw new Error('Category not found')
    }
    return category
  }

  @Authorized('ADMIN')
  @Mutation(() => Category)
  async categoryCreate(
    @Arg('data', () => CategoryCreateInput) data: CategoryCreateInput
  ): Promise<Category> {
    const newCategory = new Category()
    Object.assign(newCategory, data)
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

  @Authorized('ADMIN')
  @Mutation(() => Category, { nullable: true })
  async categoryUpdate(
    @Arg('id', () => ID) id: number,
    @Arg('data') data: CategoryUpdateInput
  ): Promise<Category | null> {
    const category = await Category.findOne({
      where: { id },
    })
    if (category) {
      Object.assign(category, data)

      const errors = await validate(category)
      if (errors.length === 0) {
        await category.save()
      } else {
        throw new Error(`Error occured: ${JSON.stringify(errors)}`)
      }
    }
    return category
  }

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
