import {
  BaseEntity,
  OneToMany,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  Index,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Ad } from "./Ad";
import { Category } from "./Category";
import { Length } from "class-validator";

@Entity()
export class SubCategory extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 50 })
  @Length(3, 50, { message: "Entre 3 et 50 caractères" })
  @Index()
  name!: string;

  @Column({ length: 100 })
  @Length(10, 100, { message: "Entre 10 et 100 caractères" })
  picture!: string;

  @OneToMany(() => Ad, (ad) => ad.subCategory)
  ads!: Ad[];

  @ManyToOne(() => Category, (Category) => Category.subCategory)
  @JoinColumn({ name: "category" })
  category!: Category;
}
