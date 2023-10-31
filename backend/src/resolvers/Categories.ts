import { Arg, Query, Resolver, Mutation } from "type-graphql";
import { Category, CategoryCreateInput } from "../entities/Category";
import { validate } from "class-validator";

@Resolver(Category)
export class CategoriesResolver {
  @Query(() => [Category])
  async categoriesGetAll(): Promise<Category[]> {
    const categories = await Category.find({
      relations: { subCategory: true },
      order: { name: "ASC" },
    });
    return categories;
  }
  @Query(() => Category)
  async categoryById(@Arg("id") id: number): Promise<Category> {
    const category = await Category.findOne({
      where: { id },
      relations: { subCategory: true },
    });
    if (!category) {
      throw new Error("Category not found");
    }
    return category;
  }
  @Mutation(() => Category)
  async categoryCreate(
    @Arg("data", () => CategoryCreateInput) data: CategoryCreateInput
  ): Promise<Category> {
    const newCategory = new Category();
    Object.assign(newCategory, data);

    const errors = await validate(newCategory);
    if (errors.length === 0) {
      await newCategory.save();
      return newCategory;
    } else {
      throw new Error(`Error occured: ${JSON.stringify(errors)}`);
    }
  }
}
