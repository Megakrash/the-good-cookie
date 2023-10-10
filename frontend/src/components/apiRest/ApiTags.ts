import axios from "axios";
import { API_URL } from "@/configApi";
import { TagsTypes } from "@/types";

export const getAllTags = async (
  setTags: (tags: TagsTypes) => void
): Promise<void> => {
  try {
    const res = await axios.get(`${API_URL}/tag`);
    setTags(res.data);
  } catch (error) {
    console.error("error fetching tags", error);
  }
};
