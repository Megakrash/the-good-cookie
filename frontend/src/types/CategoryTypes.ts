import { AdTypes } from "./AdTypes";

type ChildCategoryType = {
  id: number;
  name: string;
  picture?: string;
  childCategories?: ChildCategoryType[];
};

export type CategoryTypes = {
  id: number;
  name: string;
  picture?: string;
  parentCategory?: CategoryTypes;
  ads?: AdTypes;
  childCategories?: ChildCategoryType[];
};

export type CategoriesTypes = CategoryTypes[];

export type CategoryFormData = {
  name: string;
  parentCategory?: {
    id: number;
  };
  picture?: string;
};
