require("dotenv").config();

import { DataSource } from "typeorm";
import { Category } from "./entities/Category";
import { Ad } from "./entities/Ad";
import { Tag } from "./entities/Tag";
import { SubCategory } from "./entities/SubCategory";
import { User } from "./entities/User";

export const dataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [Category, Ad, Tag, SubCategory, User],
  synchronize: true,
  // logging: true,
});
