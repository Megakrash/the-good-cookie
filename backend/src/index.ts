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
//-----------TRY CATCH ERRORS--------------
//-----------------------------------------

function asyncController(controller: Function) {
  return async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      await controller(req, res, next);
    } catch (err) {
      console.error(err);
      res.status(500).send();
    }
  };
}

//-----------------------------------------
//-----------------ADS---------------------
//-----------------------------------------

const adsController = new AdsController();
app.get("/api/ads", asyncController(adsController.getAll));
app.get("/api/ads/:id", asyncController(adsController.getOne));
app.post("/api/ads", asyncController(adsController.createOne));
app.delete("/api/ads/:id", asyncController(adsController.deleteOne));
app.patch("/api/ads/:id", asyncController(adsController.patchOne));

//-----------------------------------------
//-----------------CATEGORY----------------
//-----------------------------------------

const categoriesController = new CategoriesController();
app.get("/api/category", asyncController(categoriesController.getAll));
app.get("/api/category/:id", asyncController(categoriesController.getOne));
app.post("/api/category", categoriesController.createOne);
app.delete(
  "/api/category/:id",
  asyncController(categoriesController.deleteOne)
);
app.patch("/api/category/:id", asyncController(categoriesController.patchOne));

//-----------------------------------------
//-----------------TAG---------------------
//-----------------------------------------

const tagsController = new TagsController();
app.get("/api/tag", asyncController(tagsController.getAll));
app.get("/api/tag/:id", asyncController(tagsController.getOne));
app.post("/api/tag", tagsController.createOne);
app.delete("/api/tag/:id", asyncController(tagsController.deleteOne));
app.patch("/api/tag/:id", asyncController(tagsController.patchOne));

//-----------------------------------------
//-------------SERVER LISTENING------------
//-----------------------------------------

app.listen(port, async () => {
  await dataSource.initialize();
  console.warn(`Server is listening on port ${port} 👍`);
});
