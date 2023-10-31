import { Arg, Mutation, Query, Resolver } from "type-graphql";
import { SubCategory, SubCategoryCreateInput } from "../entities/SubCategory";
import { validate } from "class-validator";

@Resolver(SubCategory)
export class SubCategoriesResolver {
  @Query(() => [SubCategory])
  async subCategoriesGetAll(): Promise<SubCategory[]> {
    const subCategories = await SubCategory.find({
      relations: { ads: true, category: true },
      order: { name: "ASC" },
    });
    return subCategories;
  }
  @Query(() => SubCategory)
  async subCategoryById(@Arg("id") id: number): Promise<SubCategory> {
    const subCategory = await SubCategory.findOne({
      where: { id },
      relations: { ads: true, category: true },
    });
    if (!subCategory) {
      throw new Error("SubCategory not found");
    }
    return subCategory;
  }
  @Mutation(() => SubCategory)
  async subCategoryCreate(
    @Arg("data", () => SubCategoryCreateInput) data: SubCategoryCreateInput
  ): Promise<SubCategory> {
    const newSubCategory = new SubCategory();
    Object.assign(newSubCategory, data);

    const errors = await validate(newSubCategory);
    if (errors.length === 0) {
      await newSubCategory.save();
      return newSubCategory;
    } else {
      throw new Error(`Error occured: ${JSON.stringify(errors)}`);
    }
  }
}
