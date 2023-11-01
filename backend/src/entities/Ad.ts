import {
  BaseEntity,
  ManyToOne,
  JoinColumn,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  Index,
  ManyToMany,
  JoinTable,
} from "typeorm";
import { Length, IsInt, Matches } from "class-validator";
import { Field, ID, InputType, ObjectType, Int } from "type-graphql";
import { SubCategory } from "./SubCategory";
import { Tag } from "./Tag";
import { User } from "./User";
import { ObjectId } from "./ObjectId";
import { IsExisting } from "../utils/utils";

@Entity()
@ObjectType()
export class Ad extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id!: number;

  @Column({ length: 100 })
  @Length(10, 100, { message: "Entre 10 et 100 caractères" })
  @Index()
  @Field()
  title!: string;

  @Column()
  @Field()
  description!: string;

  @Column()
  @IsInt()
  @Field()
  price!: number;

  @Column()
  @Length(8, 12, { message: "Entre 8 et 12 caractères" })
  @Field()
  createdDate!: string;

  @Column()
  @Length(8, 12, { message: "Entre 8 et 12 caractères" })
  @Field()
  updateDate!: string;

  @Column({ length: 500 })
  @Field()
  picture!: string;

  @Column({ length: 100 })
  @Matches(/^[a-zA-Z]+$/, {
    message: "La ville ne doit contenir que des lettres",
  })
  @Field()
  location!: string;

  @ManyToOne(() => SubCategory, (subCategory) => subCategory.ads, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "subCategory" })
  @IsExisting(() => SubCategory)
  @Field(() => SubCategory)
  subCategory!: SubCategory;

  @ManyToOne(() => User, (user) => user.ads, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "user" })
  @Field(() => User)
  user!: User;

  @ManyToMany(() => Tag, (tag) => tag.ads)
  @JoinTable()
  @Field(() => [Tag])
  tags!: Tag[];
}

@InputType()
export class AdCreateInput {
  @Field()
  title!: string;

  @Field()
  description!: string;

  @Field()
  price!: number;

  @Field()
  picture!: string;

  @Field()
  location!: string;

  @Field()
  subCategory!: ObjectId;

  @Field(() => ObjectId)
  user!: ObjectId;

  @Field(() => [ObjectId])
  tags!: ObjectId[];
}

@InputType()
export class AdUpdateInput {
  @Field({ nullable: true })
  title!: string;

  @Field({ nullable: true })
  description!: string;

  @Field({ nullable: true })
  price!: number;

  @Field({ nullable: true })
  picture!: string;

  @Field({ nullable: true })
  location!: string;

  @Field({ nullable: true })
  subCategory!: ObjectId;

  @Field(() => ObjectId, { nullable: true })
  user!: ObjectId;

  @Field(() => [ObjectId], { nullable: true })
  tags!: ObjectId[];
}

@InputType()
export class AdsWhere {
  @Field(() => [ID], { nullable: true })
  subCategory?: number[];

  @Field(() => String, { nullable: true })
  title?: string;

  @Field(() => Int, { nullable: true })
  minPrice?: number;

  @Field(() => Int, { nullable: true })
  maxPrice?: number;

  @Field(() => String, { nullable: true })
  location?: string;
}
