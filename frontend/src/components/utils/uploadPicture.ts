import { MIDDLEWARE_URL } from "@/api/configApi";
import axios from "axios";

export const uploadPicture = async (
  title: string,
  picture: File,
): Promise<number> => {
  const dataFile = new FormData();
  dataFile.append("title", title);
  dataFile.append("file", picture);

  const uploadPictureResponse = await axios.post(
    `${MIDDLEWARE_URL}picture`,
    dataFile,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );
  if (!uploadPictureResponse.data.id) {
    throw new Error("Error while uploading picture");
  }
  const pictureId = uploadPictureResponse.data.id;
  return pictureId;
};
