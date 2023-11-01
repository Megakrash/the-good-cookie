const multer = require("multer");
const path = require("path");
import express from "express";

const generateFileName = (
  req: express.Request,
  picture: Express.Multer.File,
  cb: (error: Error | null, filename: string) => void
) => {
  const ext = path.extname(picture.originalname);
  const now = new Date();
  const timestamp = `${now.getFullYear()}-${(now.getMonth() + 1)
    .toString()
    .padStart(2, "0")}${now.getDate().toString().padStart(2, "0")}-${now
    .getHours()
    .toString()
    .padStart(2, "0")}${now.getMinutes().toString().padStart(2, "0")}${now
    .getSeconds()
    .toString()
    .padStart(2, "0")}`;
  req.body.filename = `${req.body.title.toUpperCase()}_${timestamp}${
    ext === ".jpg" ? ".jpg" : ".png"
  }`.replace(/\s+/g, "");
  cb(null, req.body.filename);
};

const createMulterStorage = (destinationPath: string) =>
  multer.diskStorage({
    destination: (
      req: express.Request,
      picture: Express.Multer.File,
      cb: (error: Error | null, filename: string) => void
    ) => {
      cb(null, destinationPath);
    },
    filename: generateFileName,
  });

export const uploadAdPicture = multer({
  storage: createMulterStorage("./public/assets/images/ads"),
});
