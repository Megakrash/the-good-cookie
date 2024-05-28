import { PictureType } from "./PictureTypes";

type ChildCategoryType = {
  id: number;
  name: string;
  picture?: PictureType;
  childCategories?: ChildCategoryType[];
};

export type CategoryTypes = {
  id: number;
  name: string;
  childCategories?: ChildCategoryType[];
};

export type CategoriesTypes = CategoryTypes[];

export type CategoryFormData = {
  name: string;
};
