export type CategoriesTypes = {
  id: number;
  name: string;
  subCategory: [
    {
      id: number;
      name: string;
    }
  ];
};

export type SubCategoriesTypes = {
  id: number;
  name: string;
  picture: string;
  category: {
    id: number;
    name: string;
  };
};

export type AdsTypes = {
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
  tags: [
    {
      id: number;
      name: string;
    }
  ];
  user: {
    id: number;
    nickName: string;
  };
};

export type AdFormData = {
  title: string;
  description: string;
  price: number;
  picture: string;
  location: string;
  category: { id: number };
};

export type SearchAds = AdsTypes[];
