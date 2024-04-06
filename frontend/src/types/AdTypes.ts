export type AdTypes = {
  id: number;
  title: string;
  description: string;
  price: number;
  createdAt: string;
  updatedAt: string;
  picture: {
    id: number;
    filename: string;
  };
  zipCode: string;
  city: string;
  coordinates: [number, number];
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
    picture: {
      id: number;
      filename: string;
    };
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
  zipCode: string;
  city: string;
  coordinates: [number, number];
  pictureId?: number;
  price: number;
  subCategory: { id: number } | null;
  tags?: AdTags | null;
};
