// Categories
export type CategoryTypes = {
  id: number;
  name: string;
  subCategory: [
    {
      id: number;
      name: string;
    }
  ];
};

export type CategoriesTypes = CategoryTypes[];

// SubCategories
export type SubCategoryTypes = {
  id: number;
  name: string;
  picture: string;
  category: {
    id: number;
    name: string;
  };
};

export type SubCategoriesTypes = SubCategoryTypes[];

// Ads
export type AdTypes = {
  id: number;
  title: string;
  description: string;
  price: number;
  createdDate: string;
  updateDate: string;
  picture: string;
  location: string;
  subCategory: {
    id: number;
    name: string;
  };
  tags: {
    id: number;
    name: string;
  }[];
  user: {
    id: number;
    nickName: string;
  };
};

export type AdsTypes = AdTypes[];

export type AdFormData = {
  title: string;
  description: string;
  price: number;
  picture: string;
  location: string;
  category: { id: number };
};

export type SearchAds = AdsTypes[];
