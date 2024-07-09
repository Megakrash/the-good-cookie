import axios from "axios";

export const uploadPicture = async (
  title: string,
  picture: File,
): Promise<string> => {
  const dataFile = new FormData();
  dataFile.append("title", title);
  dataFile.append("file", picture);

  const uploadPictureResponse = await axios.post(
    `${process.env.NEXT_PUBLIC_PATH_IMAGE}`,
    dataFile,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );
  if (!uploadPictureResponse.data.filename) {
    throw new Error("Error while uploading picture");
  }
  const filename = uploadPictureResponse.data.filename;
  return filename;
};
