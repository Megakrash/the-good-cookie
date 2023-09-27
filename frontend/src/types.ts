export type CategoriesTypes = {
  id: number;
  name: string;
};

export type AdsTypes = {
  id: number;
  title: string;
  description: string;
  owner: string;
  price: number;
  createdDate: string;
  picture: string;
  location: string;
  category: {
    id: number;
    name: string;
  };
  tags: [
    {
      id: number;
      name: string;
    }
  ];
};

export type AdFormData = {
  title: string;
  description: string;
  price: number;
  picture: string;
  location: string;
  category: { id: number };
};
