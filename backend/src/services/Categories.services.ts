import { Category } from '../entities/Category'

export class CategoriesServices {
  // Check if Category name is already used in parent Category or among root categories
  static async existingCategory(
    name: string,
    parentCategoryId?: number
  ): Promise<Category | null> {
    const existingCategory = await Category.findOne({
      where: { name: name },
      relations: { parentCategory: true },
    })

    if (existingCategory) {
      if (parentCategoryId) {
        if (existingCategory.parentCategory?.id === Number(parentCategoryId)) {
          throw new Error(
            `Category name already used in category ${existingCategory.parentCategory.name}`
          )
        }
      } else {
        if (!existingCategory.parentCategory) {
          throw new Error(`Category name already used among root categories`)
        }
      }
    }

    return existingCategory
  }
}
