import { AdTypes } from "./AdTypes";

type ChildCategoryType = {
  id: string;
  name: string;
  display: boolean;
  picture?: string;
  createdAt: string;
  updatedAt: string;
  childCategories?: ChildCategoryType[];
};

export type CategoryTypes = {
  id: string;
  name: string;
  display: boolean;
  picture?: string;
  createdAt: string;
  updatedAt: string;
  parentCategory?: CategoryTypes;
  ads?: AdTypes;
  childCategories?: ChildCategoryType[];
  adCount?: number;
};

export type CategoryFormData = {
  name: string;
  display?: boolean;
  parentCategory?: {
    id: string;
  };
  picture?: string;
};
