// Categories
export type CategoryTypes = {
  id: number;
  name: string;
  subCategories: [
    {
      id: number;
      name: string;
      picture: string;
    }
  ];
};

export type CategoriesTypes = CategoryTypes[];

// SubCategories
export type SubCategoryTypes = {
  id: number;
  name: string;
  picture: string;
  ads?: {
    id: number;
    title: string;
    description: string;
    price: number;
    createdDate: string;
    updateDate: string;
    picture: string;
    location: string;
    tags?: {
      id: number;
      name: string;
    }[];
    user?: {
      id: number;
      nickName: string;
    };
  };
  category?: {
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
    category: {
      id: number;
      name: string;
    };
  };
  tags: {
    id: number;
    name: string;
  }[];
  user: {
    id: number;
    nickName: string;
    picture: string;
  };
};

export type AdsTypes = AdTypes[];

export type Tag = {
  id: string;
};
export type AdTag = { id: number };
export type AdTags = AdTag[];

export type AdFormData = {
  title: string;
  description: string;
  location: string;
  picture: string;
  price: number;
  subCategory: { id: number } | null;
  tags?: AdTags | null;
  user?: { id: number };
};

// Tags

export type TagTypes = {
  id: number;
  name: string;
};

export type TagsTypes = TagTypes[];

// Users
export type UserFormData = {
  firstName: string;
  lastName: string;
  nickName: string;
  email: string;
  password: string;
  picture: string;
  adress: string;
  zipCode: string;
  city: string;
  phoneNumber: string;
  isAdmin: boolean;
};
