import {
  BaseEntity,
  OneToMany,
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Ad } from "./Ad";
import {
  IsBoolean,
  IsEmail,
  IsNumberString,
  IsStrongPassword,
  Length,
  Matches,
} from "class-validator";

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 50 })
  @Length(2, 50, { message: "Entre 2 et 50 caractères" })
  @Matches(/^[a-zA-Z]+$/, {
    message: "Le prénom ne doit contenir que des lettres",
  })
  firstName!: string;

  @Column({ length: 50 })
  @Length(2, 50, { message: "Entre 2 et 50 caractères" })
  @Matches(/^[a-zA-Z]+$/, {
    message: "Le nom de famille ne doit contenir que des lettres",
  })
  lastName!: string;

  @Column({ length: 50, nullable: true })
  @Length(2, 50, { message: "Entre 2 et 50 caractères" })
  nickName!: string;

  @Column({ length: 100 })
  @IsEmail()
  email!: string;

  @Column({ length: 250 })
  @IsStrongPassword()
  password!: string;

  @Column()
  @Length(8, 10, { message: "Entre 8 et 10 caractères" })
  registrationDate!: string;

  @Column({ length: 100, nullable: true })
  @Length(5, 100, { message: "Entre 5 et 100 caractères" })
  adress!: string;

  @Column({ length: 5, nullable: true })
  @IsNumberString(
    {},
    { message: "Le code postal doit être une chaîne de chiffres" }
  )
  @Length(5, 5, { message: "Le code postal doit avoir exactement 5 chiffres" })
  zipCode!: string;

  @Column({ length: 50, nullable: true })
  @Length(3, 50, { message: "Entre 3 et 50 caractères" })
  city!: string;

  @Column({ length: 10, nullable: true })
  @IsNumberString(
    {},
    { message: "Le numéro de téléphone doit être une chaîne de chiffres" }
  )
  @Length(10, 10, {
    message: "Le numéro de téléphone doit avoir exactement 10 chiffres",
  })
  phoneNumber!: string;

  @Column({ type: "boolean", default: 0 })
  @IsBoolean()
  isAdmin!: boolean;

  @OneToMany(() => Ad, (ad) => ad.user)
  ads!: Ad[];
}
