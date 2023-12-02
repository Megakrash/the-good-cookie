//-----------------------------------------
//-----------------TYPE ORM----------------
//-----------------------------------------

import "reflect-metadata";
import { dataSource } from "./datasource";

//-----------------------------------------
//-----------------MULTER------------------
//-----------------------------------------

import { uploadAdPicture, uploadUserPicture } from "./multer/multer";

//-----------------------------------------
//----------GRAPHQL / APOLLO SERVER--------
//-----------------------------------------

import { buildSchema } from "type-graphql";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";

//-----------------------------------------
//-----------------RESOLVERS---------------
//-----------------------------------------

import { TagsResolver } from "./resolvers/Tags";
import { AdsResolver } from "./resolvers/Ads";
import { CategoriesResolver } from "./resolvers/Categories";
import { SubCategoriesResolver } from "./resolvers/SubCategories";
import { UsersResolver } from "./resolvers/Users";

//-----------------------------------------
//-----------------EXPRESS-----------------
//-----------------------------------------

import express from "express";
import http from "http";
import cors from "cors";
import path from "path";
import axios from "axios";
import { Request, Response } from "express";

//-----------------------------------------
//-----------------APOLLO SERVER-----------
//-----------------------------------------
interface MyContext {
  token?: String;
}

const app = express();
const corsOptions = {
  origin: "http://localhost:3000",
  optionsSuccessStatus: 200,
};
async function start() {
  const port = 5000;
  const schema = await buildSchema({
    resolvers: [
      TagsResolver,
      AdsResolver,
      CategoriesResolver,
      SubCategoriesResolver,
      UsersResolver,
    ],
  });

  const httpServer = http.createServer(app);
  const server = new ApolloServer({
    schema,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });

  await dataSource.initialize();
  await server.start();
  app.use(
    "/",
    cors<cors.CorsRequest>(),
    express.json({ limit: "50mb" }),
    expressMiddleware(server, {
      context: async ({ req }) => ({ token: req.headers.token }),
    })
  );

  await new Promise<void>((resolve) =>
    httpServer.listen({ port: 5000 }, resolve)
  );
  console.log(`🚀 Server ready at port 5000 🚀`);
}

start();

app.use(express.json());
app.use(cors(corsOptions));
app.use(express.static(path.join(__dirname, "../public")));

app.post(
  "/upload",
  uploadAdPicture.single("file"),
  (req: Request, res: Response) => {
    if (req.file) {
      res.json({ filename: req.file.filename });
    } else {
      res.status(400).send("No file was uploaded.");
    }
  }
);

app.post(
  "/avatar",
  uploadUserPicture.single("file"),
  (req: Request, res: Response) => {
    if (req.file) {
      res.json({ filename: req.file.filename });
    } else {
      res.status(400).send("No file was uploaded.");
    }
  }
);
// Api search adress.gouv
app.get("/search-address", async (req: Request, res: Response) => {
  try {
    const query = req.query.q;
    const response = await axios.get(
      `https://api-adresse.data.gouv.fr/search/?q=city=${query}&limit=5`
    );
    res.json(response.data);
  } catch (error) {
    console.error("Erreur lors de la requête à l'API:", error);
    res.status(500).send("Erreur interne du serveur");
  }
});

// Send contact email
import { verifyRecaptchaToken } from "./utils/reCaptcha";
import { sendContactEmail } from "./utils/nodeMailer";
app.post("/sendcontactemail", verifyRecaptchaToken, sendContactEmail);
