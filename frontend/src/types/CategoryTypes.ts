export type CategoryTypes = {
  id: number;
  name: string;
  subCategories?: [
    {
      id: number;
      name: string;
      picture: string;
    },
  ];
};

export type CategoriesTypes = CategoryTypes[];
