import {
  BaseEntity,
  OneToMany,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
} from "typeorm";
import {
  IsEmail,
  IsNumberString,
  IsOptional,
  Length,
  Matches,
} from "class-validator";
import {
  Field,
  ID,
  InputType,
  ObjectType,
  registerEnumType,
} from "type-graphql";
import { Ad } from "./Ad";
import { ObjectId } from "./ObjectId";
import { IsCoordinates } from "./Coordinates";
import { Picture } from "./Picture";

export enum Role {
  USER = "USER",
  ADMIN = "ADMIN",
}

registerEnumType(Role, {
  name: "Role",
});

@Entity()
@ObjectType()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id!: number;

  @Column({ length: 50 })
  @Length(2, 50, { message: "Entre 2 et 50 caractères" })
  @Matches(/^[a-zA-ZÀ-ÿ-]+$/, {
    message: "Le prénom ne doit contenir que des lettres",
  })
  @Field()
  firstName!: string;

  @Column({ length: 50 })
  @Length(2, 50, { message: "Entre 2 et 50 caractères" })
  @Matches(/^[a-zA-ZÀ-ÿ-]+$/, {
    message: "Le nom de famille ne doit contenir que des lettres",
  })
  @Field()
  lastName!: string;

  @Column({ length: 50, nullable: true })
  @Length(2, 50, { message: "Entre 2 et 50 caractères" })
  @Field({ nullable: true })
  nickName!: string;

  @OneToOne(() => Picture, { nullable: true, onDelete: "CASCADE" })
  @JoinColumn()
  @Field({ nullable: true })
  picture?: Picture;

  @Column({ length: 255, unique: true })
  @Field()
  @IsEmail()
  email!: string;

  @Column({ length: 250 })
  hashedPassword!: string;

  @Column()
  @Length(8, 12, { message: "Entre 8 et 12 caractères" })
  @Field()
  registrationDate!: string;

  @Column({ length: 100, nullable: true })
  @IsOptional()
  @Length(5, 100, { message: "Entre 5 et 100 caractères" })
  @Field({ nullable: true })
  adress!: string;

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

  @Column({ length: 10, nullable: true })
  @IsOptional()
  @IsNumberString(
    {},
    { message: "Le numéro de téléphone doit être une chaîne de chiffres" }
  )
  @Length(10, 10, {
    message: "Le numéro de téléphone doit avoir exactement 10 chiffres",
  })
  @Field({ nullable: true })
  phoneNumber!: string;

  @Column({
    type: "enum",
    enum: Role,
    default: Role.USER,
  })
  @Field(() => Role)
  role!: Role;

  @OneToMany(() => Ad, (ad) => ad.user)
  @Field(() => [Ad])
  ads!: Ad[];
}

@InputType()
export class UserCreateInput {
  @Field()
  firstName!: string;

  @Field()
  lastName!: string;

  @Field()
  nickName!: string;

  @Field({ nullable: true })
  pictureId?: number;

  @Field()
  email!: string;

  @Field()
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/)
  password!: string;

  @Field({ nullable: true })
  adress?: string;

  @Field()
  zipCode!: string;

  @Field()
  city!: string;

  @Field(() => [Number])
  coordinates!: number[];

  @Field({ nullable: true })
  phoneNumber?: string;

  @Field(() => Role)
  role!: Role;
}

@InputType()
export class UserUpdateInput {
  @Field({ nullable: true })
  firstName!: string;

  @Field({ nullable: true })
  lastName!: string;

  @Field({ nullable: true })
  nickName!: string;

  @Field({ nullable: true })
  picture!: string;

  @Field({ nullable: true })
  adress!: string;

  @Field({ nullable: true })
  zipCode!: string;

  @Field({ nullable: true })
  city!: string;

  @Field(() => [Number], { nullable: true })
  coordinates!: number[];

  @Field({ nullable: true })
  phoneNumber!: string;

  @Field({ nullable: true })
  role!: Role;

  @Field(() => [ObjectId], { nullable: true })
  ads!: ObjectId[];
}

@InputType()
export class UserLoginInput {
  @Field()
  email!: string;

  @Field()
  password!: string;
}

@ObjectType()
export class UserContext {
  @Field()
  id!: number;

  @Field()
  nickName!: string;

  @Field(() => Role)
  role!: Role;
}
