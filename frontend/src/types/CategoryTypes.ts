export type CategoryTypes = {
  id: number;
  name: string;
  subCategories?: [
    {
      id: number;
      name: string;
      picture: {
        id: number;
        filename: string;
      };
    },
  ];
};

export type CategoriesTypes = CategoryTypes[];

export type CategoryFormData = {
  name: string;
};
