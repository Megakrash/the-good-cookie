import { DataSource } from "typeorm";
import { Category } from "./entities/Category";
import { Ad } from "./entities/Ad";
import { Tag } from "./entities/Tag";
import { SubCategory } from "./entities/SubCategory";
import { User } from "./entities/User";
import { Picture } from "./entities/Picture";

export const dataSource = new DataSource({
  type: "postgres",
  host: process.env.POSTGRES_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  entities: [Category, Ad, Tag, SubCategory, User, Picture],
  synchronize: true,
  // logging: true,
});
