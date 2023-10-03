import axios from "axios";
import { API_URL } from "@/configApi";
import { CategoriesTypes } from "@/types";

export const getAllCategories = async (
  setCategories: (categories: CategoriesTypes) => void
): Promise<void> => {
  try {
    const res = await axios.get(`${API_URL}/category`);
    setCategories(res.data);
  } catch (error) {
    console.error("error fetching categories", error);
  }
};
