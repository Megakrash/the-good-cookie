import { CategoryTypes } from "./CategoryTypes";
import { UserTypes } from "./UserTypes";

export type AdTypes = {
  id: string;
  title: string;
  description: string;
  price: number;
  createdAt: string;
  updatedAt: string;
  picture: string;
  zipCode: string;
  city: string;
  location: {
    coordinates: [number, number];
  };
  tags: {
    id: string;
    name: string;
  }[];
  user: UserTypes;
  category: CategoryTypes;
};

export type Tag = {
  id: string;
};
export type AdTag = { id: string };

export type AdCreateFormData = {
  title: string;
  description: string;
  zipCode: string;
  city: string;
  location: { type: string; coordinates: [number, number] };
  picture: string;
  price: number;
  category: { id: string } | null;
  tags?: AdTag[] | null;
};

export type AdUpdateFormData = {
  title?: string;
  description?: string;
  zipCode?: string;
  city?: string;
  location?: { type: string; coordinates: [number, number] };
  picture?: string;
  price?: number;
  category?: { id: string } | null;
  tags?: AdTag[] | null;
};
