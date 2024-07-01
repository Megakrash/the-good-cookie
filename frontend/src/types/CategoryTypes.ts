import { AdTypes } from "./AdTypes";

type ChildCategoryType = {
  id: number;
  name: string;
  display: boolean;
  picture?: string;
  createdAt: string;
  updatedAt: string;
  childCategories?: ChildCategoryType[];
};

export type CategoryTypes = {
  id: number;
  name: string;
  display: boolean;
  picture?: string;
  createdAt: string;
  updatedAt: string;
  parentCategory?: CategoryTypes;
  ads?: AdTypes;
  childCategories?: ChildCategoryType[];
};

export type CategoriesTypes = CategoryTypes[];

export type CategoryFormData = {
  name: string;
  display?: boolean;
  parentCategory?: {
    id: number;
  };
  picture?: string;
};
