//-----------------------------------------
//-----------------TYPE ORM----------------
//-----------------------------------------

import "reflect-metadata";
import { dataSource } from "./datasource";

//-----------------------------------------
//-----------------PICTURES----------------
//-----------------------------------------

import { uploadAdPicture, uploadUserPicture } from "./picture/multer";
import { createImage } from "./picture/createPicture";

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
import { customAuthChecker } from "./auth";
import { PictureResolver } from "./resolvers/Pictures";

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
export type UserContext = {
  id: number;
  nickName: string;
};

export interface MyContext {
  req: Request;
  res: Response;
  user?: UserContext;
}

const app = express();
const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(express.json({ limit: "50mb" }));
app.use(express.static(path.join(__dirname, "../public")));

async function start() {
  const port = 5000;
  const schema = await buildSchema({
    resolvers: [
      TagsResolver,
      AdsResolver,
      CategoriesResolver,
      SubCategoriesResolver,
      UsersResolver,
      PictureResolver,
    ],
    authChecker: customAuthChecker,
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
    express.json({ limit: "50mb" }),
    expressMiddleware(server, {
      context: async ({ req, res }: { req: Request; res: Response }) => ({
        req,
        res,
      }),
    })
  );

  await new Promise<void>((resolve) =>
    httpServer.listen({ port: port }, resolve)
  );
  console.log(`🚀 Server ready at port ${port} 🚀`);
}

start();

//-----------------------------------------
//-----------EXPRESS MIDDLEWARES-----------
//-----------------------------------------

// Upload Ad picture
app.post("/upload", uploadAdPicture.single("file"), async (req, res) => {
  if (req.file) {
    try {
      const picture = await createImage(req.file.filename);
      res.json(picture);
    } catch (error) {
      res.status(500).send("Error saving picture");
    }
  } else {
    res.status(400).send("No file was uploaded.");
  }
});

// Upload Avatar picture
app.post("/avatar", uploadUserPicture.single("file"), async (req, res) => {
  if (req.file) {
    try {
      const picture = await createImage(req.file.filename);
      res.json(picture);
    } catch (error) {
      res.status(500).send("Error saving picture");
    }
  } else {
    res.status(400).send("No file was uploaded.");
  }
});

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
