export type SubCategoryTypes = {
  id: number;
  name: string;
  picture: string;
  ads?: {
    id: number;
    title: string;
    description: string;
    price: number;
    createdAt: string;
    updatedAt: string;
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
