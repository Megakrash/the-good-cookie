//-----------------------------------------
//-----------------TYPE ORM----------------
//-----------------------------------------

import "reflect-metadata";
import { dataSource } from "./datasource";

//-----------------------------------------
//-----------------MULTER------------------
//-----------------------------------------

// import { uploadAdPicture } from "./multer/multer";

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

//-----------------------------------------
//-----------------APOLLO SERVER-----------
//-----------------------------------------
interface MyContext {
  token?: String;
}

const app = express();

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
  console.log(`🚀 Server ready at port 5000`);
}

start();

app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));
app.get("/test", (req, res) => {
  res.send("Le serveur Express fonctionne !");
});
