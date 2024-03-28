import {
  OneToMany,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
  ManyToOne,
  UpdateDateColumn,
  BaseEntity,
} from 'typeorm'
import {
  IsEmail,
  IsNumberString,
  IsOptional,
  Length,
  Matches,
} from 'class-validator'
import {
  Field,
  ID,
  InputType,
  ObjectType,
  registerEnumType,
} from 'type-graphql'
import { Ad } from './Ad'
import { ObjectId } from './ObjectId'
import { IsCoordinates } from '../utils/Coordinates'
import { Picture } from './Picture'
import { Gender, Profil, Role } from '../types/userEntity'

// Enums type-graphql
registerEnumType(Role, {
  name: 'Role',
})
registerEnumType(Profil, {
  name: 'Profil',
})
registerEnumType(Gender, {
  name: 'Gender',
})
//-------------------------------
//--------- User Entity ---------
//-------------------------------
@Entity()
@ObjectType()
export class User extends BaseEntity {
  //------------ FIELDS -----------

  // ID
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id!: number

  // Email
  @Column({ length: 255, unique: true })
  @Field()
  @IsEmail()
  email!: string

  // Profil
  @Column({
    type: 'enum',
    enum: Profil,
  })
  @Field(() => Profil)
  profil!: Profil

  // Gender
  @Column({
    type: 'enum',
    enum: Gender,
  })
  @Field(() => Gender)
  gender!: Gender

  // First name
  @Column({ length: 50 })
  @Length(2, 50, { message: 'Entre 2 et 50 caractères' })
  @Matches(/^[a-zA-ZÀ-ÿ-]+$/, {
    message: 'Le prénom ne doit contenir que des lettres',
  })
  @Field()
  firstName!: string

  // Last name
  @Column({ length: 50 })
  @Length(2, 50, { message: 'Entre 2 et 50 caractères' })
  @Matches(/^[a-zA-ZÀ-ÿ-]+$/, {
    message: 'Le nom de famille ne doit contenir que des lettres',
  })
  @Field()
  lastName!: string

  // Nickname
  @Column({ length: 50, nullable: true })
  @Length(2, 50, { message: 'Entre 2 et 50 caractères' })
  @Field({ nullable: true })
  nickName!: string

  // Adress
  @Column({ length: 100, nullable: true })
  @IsOptional()
  @Length(5, 100, { message: 'Entre 5 et 100 caractères' })
  @Field({ nullable: true })
  adress!: string

  // Zip code
  @Column({ length: 5, nullable: true })
  @IsOptional()
  @IsNumberString(
    {},
    { message: 'Le code postal doit être une chaîne de chiffres' }
  )
  @Length(5, 5, { message: 'Le code postal doit avoir exactement 5 chiffres' })
  @Field({ nullable: true })
  zipCode!: string

  // City
  @Column({ length: 50, nullable: true })
  @IsOptional()
  @Length(3, 50, { message: 'Entre 3 et 50 caractères' })
  @Field({ nullable: true })
  city!: string

  // Coordinates
  @Column('simple-array', { nullable: true })
  @IsOptional()
  @IsCoordinates({
    message:
      'Les coordonnées doivent être un tableau de deux éléments : latitude et longitude',
  })
  @Field(() => [Number], { nullable: true })
  coordinates!: number[]

  // Phone number
  @Column({ length: 10, nullable: true })
  @IsOptional()
  @IsNumberString(
    {},
    { message: 'Le numéro de téléphone doit être une chaîne de chiffres' }
  )
  @Length(10, 10, {
    message: 'Le numéro de téléphone doit avoir exactement 10 chiffres',
  })
  @Field({ nullable: true })
  phoneNumber!: string

  // Role
  @Column({
    type: 'enum',
    enum: Role,
    default: Role.USER,
  })
  @Field(() => Role, { nullable: true })
  role!: Role

  // Password
  @Column({ length: 250 })
  hashedPassword!: string

  // Is verified
  @Column({ default: false })
  isVerified!: boolean

  // ---------- INFOS ----------

  @CreateDateColumn({ type: 'timestamp' })
  @Field(() => Date)
  createdAt!: Date

  @ManyToOne(() => User, (user) => user.createdBy)
  @Field(() => User, { nullable: true })
  createdBy!: User

  @UpdateDateColumn()
  @Field(() => Date)
  updatedAt!: Date

  @ManyToOne(() => User, (user) => user.updatedBy, { nullable: true })
  @Field(() => User, { nullable: true })
  updatedBy!: User

  @Column({ type: 'timestamp', nullable: true })
  @Field(() => Date, { nullable: true })
  lastConnectionDate!: Date

  // ---------- RELATIONS ----------

  // Picture avatar
  @OneToOne(() => Picture, { nullable: true })
  @JoinColumn()
  @Field({ nullable: true })
  picture?: Picture

  // Ads
  @OneToMany(() => Ad, (ad) => ad.user)
  @Field(() => [Ad])
  ads!: Ad[]
}

//-------------------------------
//--------- User Input ----------
//-------------------------------
@InputType()
export class UserCreateInput {
  @Field()
  email!: string

  @Field(() => Profil)
  profil!: Profil

  @Field(() => Gender)
  gender!: Gender

  @Field()
  firstName!: string

  @Field()
  lastName!: string

  @Field()
  nickName!: string

  @Field({ nullable: true })
  pictureId?: number

  @Field()
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d!@#$%^&*()_+]{8,}$/, {
    message:
      'Password is not valid. At least 8 characters, 1 uppercase, 1 lowercase, 1 special characters and 1 number required!',
  })
  password!: string

  @Field({ nullable: true })
  adress?: string

  @Field({ nullable: true })
  zipCode?: string

  @Field({ nullable: true })
  city?: string

  @Field(() => [Number], { nullable: true })
  coordinates?: number[]

  @Field({ nullable: true })
  phoneNumber!: string

  @Field(() => Role, { nullable: true })
  role?: Role

  @Field({ nullable: true })
  isVerified?: boolean
}

//-------------------------------
//--------- User Update ---------
//-------------------------------
@InputType()
export class UserUpdateInput {
  @Field({ nullable: true })
  firstName!: string

  @Field({ nullable: true })
  lastName!: string

  @Field({ nullable: true })
  nickName!: string

  @Field({ nullable: true })
  pictureId?: number

  @Field({ nullable: true })
  adress!: string

  @Field({ nullable: true })
  zipCode!: string

  @Field({ nullable: true })
  city!: string

  @Field(() => [Number], { nullable: true })
  coordinates!: number[]

  @Field({ nullable: true })
  phoneNumber!: string

  @Field(() => Role, { nullable: true })
  role!: Role

  @Field(() => [ObjectId], { nullable: true })
  ads!: ObjectId[]

  @Field()
  isVerified!: boolean

  @Field({ nullable: true })
  lastConnectionDate!: Date
}

//-------------------------------
//--------- User SignIn ---------
//-------------------------------
@InputType()
export class UserLoginInput {
  @Field()
  email!: string

  @Field()
  password!: string
}

//-------------------------------
//--------- User Context --------
//-------------------------------
@ObjectType()
export class UserContext {
  @Field()
  id!: number

  @Field()
  nickName!: string

  @Field()
  picture!: string

  @Field(() => Role)
  role!: Role
}

//-------------------------------
//--------- User verify ---------
//-------------------------------
@ObjectType()
export class VerifyEmailResponse {
  @Field()
  success!: boolean

  @Field({ nullable: true })
  message?: string
}
