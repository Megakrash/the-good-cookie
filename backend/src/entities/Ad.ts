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
  OneToOne,
} from "typeorm";
import { Length, IsInt, IsNumberString } from "class-validator";
import { IsCoordinates } from "./Coordinates";
import { Field, ID, InputType, ObjectType, Int } from "type-graphql";
import { SubCategory } from "./SubCategory";
import { Tag } from "./Tag";
import { User } from "./User";
import { Picture } from "./Picture";
import { ObjectId } from "./ObjectId";

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

  // @Column({ length: 500 })
  // @Field()
  // picture!: string;

  @OneToOne(() => Picture, { nullable: true })
  @JoinColumn()
  @Field()
  picture?: Picture;

  @Column({ length: 5, nullable: true })
  @IsNumberString(
    {},
    { message: "Le code postal doit être une chaîne de chiffres" }
  )
  @Length(5, 5, { message: "Le code postal doit avoir exactement 5 chiffres" })
  @Field()
  zipCode!: string;

  @Column({ length: 50, nullable: true })
  @Length(3, 50, { message: "Entre 3 et 50 caractères" })
  @Field()
  city!: string;

  @Column("simple-array")
  @IsCoordinates({
    message:
      "Les coordonnées doivent être un tableau de deux éléments : latitude et longitude",
  })
  @Field(() => [Number])
  coordinates!: number[];

  @ManyToOne(() => SubCategory, (subCategory) => subCategory.ads, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "subCategory" })
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

  @Field({ nullable: true })
  pictureId?: number;

  @Field()
  zipCode!: string;

  @Field()
  city!: string;

  @Field(() => [Number])
  coordinates!: number[];

  @Field()
  subCategory!: ObjectId;

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
  zipCode!: string;

  @Field({ nullable: true })
  city!: string;

  @Field(() => [Number], { nullable: true })
  coordinates!: number[];

  @Field({ nullable: true })
  subCategory!: ObjectId;

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
  city?: string;

  @Field(() => String, { nullable: true })
  createdDate?: string;

  @Field(() => [String], { nullable: true })
  tags?: string[];
}
