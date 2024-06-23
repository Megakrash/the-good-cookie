import { PATH_IMAGE } from "@/api/configApi";
import axios from "axios";

export const uploadPicture = async (
  title: string,
  picture: File,
): Promise<string> => {
  const dataFile = new FormData();
  dataFile.append("title", title);
  dataFile.append("file", picture);

  const uploadPictureResponse = await axios.post(`${PATH_IMAGE}`, dataFile, {
    headers: {
      "Content-Type": "multipart/form-data",
      "Access-Control-Allow-Origin": "*",
    },
  });
  if (!uploadPictureResponse.data.filename) {
    throw new Error("Error while uploading picture");
  }
  const filename = uploadPictureResponse.data.filename;
  return filename;
};
