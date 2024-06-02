import { PATH_IMAGE } from "@/api/configApi";

export const getAdImageUrl = (filename: string): string => {
  return filename !== ""
    ? `${PATH_IMAGE}/pictures/${filename}`
    : `${PATH_IMAGE}/default/default.png`;
};

export const getUserImageUrl = (filename: string): string => {
  return filename !== ""
    ? `${PATH_IMAGE}/pictures/${filename}`
    : `${PATH_IMAGE}/default/avatar.webp`;
};
