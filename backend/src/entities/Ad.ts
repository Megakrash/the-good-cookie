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
import { Field, ID, InputType, ObjectType } from "type-graphql";
import { SubCategory } from "./SubCategory";
import { Tag } from "./Tag";
import { User } from "./User";
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
  @Length(8, 10, { message: "Entre 8 et 10 caractères" })
  @Field()
  createdDate!: string;

  @Column()
  @Length(8, 10, { message: "Entre 8 et 10 caractères" })
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

  @ManyToOne(() => SubCategory, (subCategory) => subCategory.ads)
  @JoinColumn({ name: "subCategory" })
  @Field(() => SubCategory)
  subCategory!: SubCategory;

  @ManyToOne(() => User, (user) => user.ads)
  @JoinColumn({ name: "user" })
  @Field(() => User)
  user!: User;

  @ManyToMany(() => Tag, (tag) => tag.ads)
  @JoinTable()
  @Field(() => [Tag])
  tags!: Tag[];
}

@InputType()
export class AdInput {
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

  @Field()
  user!: ObjectId;

  @Field(() => [ObjectId])
  tags!: ObjectId[];
}
