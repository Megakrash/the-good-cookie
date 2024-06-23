import { CategoryTypes } from "./CategoryTypes";
import { UserTypes } from "./UserTypes";

export type AdTypes = {
  id: number;
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
    id: number;
    name: string;
  }[];
  user: UserTypes;
  category: CategoryTypes;
};

export type AdsTypes = AdTypes[];

export type Tag = {
  id: string;
};
export type AdTag = { id: number };
export type AdTags = AdTag[];

export type AdCreateFormData = {
  title: string;
  description: string;
  zipCode: string;
  city: string;
  location: { type: string; coordinates: [number, number] };
  picture: string;
  price: number;
  category: { id: number } | null;
  tags?: AdTags | null;
};

export type AdUpdateFormData = {
  title?: string;
  description?: string;
  zipCode?: string;
  city?: string;
  location?: { type: string; coordinates: [number, number] };
  picture?: string;
  price?: number;
  category?: { id: number } | null;
  tags?: AdTags | null;
};
