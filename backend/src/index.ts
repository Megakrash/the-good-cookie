//-----------------------------------------
//-----------------TYPE ORM----------------
//-----------------------------------------

import "reflect-metadata";
import { dataSource } from "./datasource";

//-----------------------------------------
//-----------------CONTROLERS--------------
//-----------------------------------------

import { AdsController } from "./controllers/Ads";
import { CategoriesController } from "./controllers/Categories";
import { TagsController } from "./controllers/Tags";

//-----------------------------------------
//-----------------EXPRESS-----------------
//-----------------------------------------

import express from "express";

const app = express();
app.use(express.json());
const port = 5000;

//-----------------------------------------
//-----------------ADS---------------------
//-----------------------------------------

const adsController = new AdsController();
app.get("/api/ads", adsController.getAll);
app.get("/api/ads/:id", adsController.getOne);
app.post("/api/ads", adsController.createOne);
app.delete("/api/ads/:id", adsController.deleteOne);
app.patch("/api/ads/:id", adsController.patchOne);

//-----------------------------------------
//-----------------CATEGORY----------------
//-----------------------------------------

const categoriesController = new CategoriesController();
app.get("/api/category", categoriesController.getAll);
app.get("/api/category/:id", categoriesController.getOne);
app.post("/api/category", categoriesController.createOne);
app.delete("/api/category/:id", categoriesController.deleteOne);
app.patch("/api/category/:id", categoriesController.patchOne);

//-----------------------------------------
//-----------------TAG---------------------
//-----------------------------------------

const tagsController = new TagsController();
app.get("/api/tag", tagsController.getAll);
app.get("/api/tag/:id", tagsController.getOne);
app.post("/api/tag", tagsController.createOne);
app.delete("/api/tag/:id", tagsController.deleteOne);
app.patch("/api/tag/:id", tagsController.patchOne);

//-----------------------------------------
//-------------SERVER LISTENING------------
//-----------------------------------------

app.listen(port, async () => {
  await dataSource.initialize();
  console.warn(`Server is listening on port ${port} 👍`);
});
