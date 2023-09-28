import {
  BaseEntity,
  OneToMany,
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from "typeorm";
import { SubCategory } from "./SubCategory";

@Entity()
export class Category extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 100 })
  name!: string;

  @OneToMany(() => SubCategory, (subCategory) => subCategory.category)
  subCategory!: SubCategory[];
}
