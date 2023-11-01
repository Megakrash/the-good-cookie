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
import { Length } from "class-validator";
import { Field, ID, InputType, ObjectType } from "type-graphql";
import { Ad } from "./Ad";
import { Category } from "./Category";
import { ObjectId } from "./ObjectId";
import { IsExisting } from "../utils/utils";

@Entity()
@ObjectType()
export class SubCategory extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id!: number;

  @Column({ length: 50 })
  @Length(3, 50, { message: "Entre 3 et 50 caractères" })
  @Index()
  @Field()
  name!: string;

  @Column({ length: 100 })
  @Length(10, 100, { message: "Entre 10 et 100 caractères" })
  @Field()
  picture!: string;

  @OneToMany(() => Ad, (ad) => ad.subCategory)
  @Field(() => [Ad])
  ads!: Ad[];

  @ManyToOne(() => Category, (Category) => Category.subCategory, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "category" })
  @Field(() => Category)
  @IsExisting(() => Category)
  category!: Category;
}

@InputType()
export class SubCategoryCreateInput {
  @Field()
  name!: string;

  @Field()
  picture!: string;

  @Field(() => ObjectId)
  category!: ObjectId;
}

@InputType()
export class SubCategoryUpdateInput {
  @Field({ nullable: true })
  name!: string;

  @Field({ nullable: true })
  picture!: string;

  @Field(() => ObjectId, { nullable: true })
  category!: ObjectId;
}
