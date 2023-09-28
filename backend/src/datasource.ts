import { DataSource } from "typeorm";
import { Category } from "./entities/Category";
import { Ad } from "./entities/Ad";
import { Tag } from "./entities/Tag";
import { SubCategory } from "./entities/SubCategory";
import { User } from "./entities/User";

export const dataSource = new DataSource({
  type: "sqlite",
  database: "tgc.sqlite",
  entities: [Category, Ad, Tag, SubCategory, User],
  synchronize: true,
  logging: true,
});
