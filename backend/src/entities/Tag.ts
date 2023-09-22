import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  Index,
  ManyToMany,
} from "typeorm";
import { Length } from "class-validator";
import { Ad } from "./Ad";

@Entity()
export class Tag extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 100 })
  @Length(3, 50, { message: "Entre 10 et 50 caractères" })
  @Index()
  name!: string;

  @ManyToMany(() => Ad, (ad) => ad.tags)
  ads!: Ad[];
}
