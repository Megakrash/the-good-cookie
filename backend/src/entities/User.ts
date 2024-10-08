import {
  OneToMany,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  UpdateDateColumn,
  BaseEntity,
  Unique,
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
import { Message } from './Message'
import { GenderEnum, ProfilEnum, RoleEnum } from '../types/Users.types'
import { PointInput, PointType } from './Geolocation'
import { Conversation } from './Conversation'

//-------------------------------
//----- Enums type-graphql ------
//-------------------------------
registerEnumType(RoleEnum, {
  name: 'Role',
})
registerEnumType(ProfilEnum, {
  name: 'Profil',
})
registerEnumType(GenderEnum, {
  name: 'GenderEnum',
})
//-------------------------------
//--------- User Entity ---------
//-------------------------------
@Entity()
@ObjectType()
@Unique(['id'])
export class User extends BaseEntity {
  //------------ FIELDS -----------

  // ID
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id!: string

  // Email
  @Column({ length: 255, unique: true })
  @Field()
  @IsEmail()
  email!: string

  // Profil
  @Column({
    type: 'enum',
    enum: ProfilEnum,
  })
  @Field(() => ProfilEnum)
  profil!: ProfilEnum

  // Gender
  @Column({
    type: 'enum',
    enum: GenderEnum,
  })
  @Field(() => GenderEnum)
  gender!: GenderEnum

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

  // Location - coordinates
  @Column({
    type: 'geometry',
    spatialFeatureType: 'Point',
    srid: 4326,
    nullable: true,
  })
  @Field(() => PointType, { nullable: true })
  location?: {
    type: 'Point'
    coordinates: [number, number]
  }

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
    enum: RoleEnum,
    default: RoleEnum.USER,
  })
  @Field(() => RoleEnum, { nullable: true })
  role!: RoleEnum

  // Password
  @Column({ length: 250 })
  hashedPassword!: string

  // Is verified
  @Column({ default: false })
  @Field()
  isVerified!: boolean

  // Picture
  @Column({ length: 250 })
  @Field({ nullable: true })
  picture!: string

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

  // Ads
  @OneToMany(() => Ad, (ad) => ad.user, { eager: true })
  @Field(() => [Ad])
  ads!: Ad[]

  // Messages
  @OneToMany(() => Message, (message) => message.sender)
  @Field(() => [Message])
  sentMessages!: Message[]

  @OneToMany(() => Message, (message) => message.receiver)
  @Field(() => [Message])
  receivedMessages!: Message[]

  // Conversations
  @OneToMany(() => Conversation, (conversation) => conversation.user1)
  @Field(() => [Conversation])
  conversations!: Conversation[]
}

//-------------------------------
//--------- User Input ----------
//-------------------------------
@InputType()
export class UserCreateInput {
  @Field()
  email!: string

  @Field(() => ProfilEnum)
  profil!: ProfilEnum

  @Field(() => GenderEnum)
  gender!: GenderEnum

  @Field()
  firstName!: string

  @Field()
  lastName!: string

  @Field()
  nickName!: string

  @Field({ nullable: true })
  picture!: string

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

  @Field(() => PointInput, { nullable: true })
  location?: PointInput

  @Field({ nullable: true })
  phoneNumber!: string

  @Field(() => RoleEnum, { nullable: true })
  role?: RoleEnum

  @Field({ nullable: true })
  isVerified?: boolean
}

//-------------------------------
//--------- User Update ---------
//-------------------------------
@InputType()
export class UserUpdateInput {
  @Field(() => ProfilEnum, { nullable: true })
  profil!: ProfilEnum

  @Field(() => GenderEnum, { nullable: true })
  gender!: GenderEnum

  @Field({ nullable: true })
  firstName!: string

  @Field({ nullable: true })
  lastName!: string

  @Field({ nullable: true })
  nickName!: string

  @Field({ nullable: true })
  picture!: string

  @Field({ nullable: true })
  currentPassword!: string

  @Field({ nullable: true })
  newPassword!: string

  @Field({ nullable: true })
  adress!: string

  @Field({ nullable: true })
  zipCode!: string

  @Field({ nullable: true })
  city!: string

  @Field(() => PointInput, { nullable: true })
  location?: PointInput

  @Field({ nullable: true })
  phoneNumber!: string

  @Field(() => RoleEnum, { nullable: true })
  role!: RoleEnum

  @Field(() => [ObjectId], { nullable: true })
  ads!: ObjectId[]

  @Field({ nullable: true })
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
  id!: string

  @Field()
  nickName!: string

  @Field({ nullable: true })
  picture!: string

  @Field()
  role!: string
}

//-------------------------------
//--------- User Me -------------
//-------------------------------
@ObjectType()
export class MeUser {
  @Field(() => ID)
  id!: string

  @Field()
  email!: string

  @Field()
  profil!: string

  @Field()
  gender!: string

  @Field()
  firstName!: string

  @Field()
  lastName!: string

  @Field({ nullable: true })
  nickName!: string

  @Field({ nullable: true })
  adress!: string

  @Field({ nullable: true })
  zipCode!: string

  @Field({ nullable: true })
  city!: string

  @Field({ nullable: true })
  phoneNumber!: string

  @Field({ nullable: true })
  role!: string

  @Field(() => Date)
  createdAt!: Date

  @Field(() => Date, { nullable: true })
  updatedAt!: Date

  @Field(() => User, { nullable: true })
  updatedBy!: User

  @Field(() => Date, { nullable: true })
  lastConnectionDate!: Date

  @Field({ nullable: true })
  picture!: string

  @Field(() => [Ad])
  ads!: Ad[]
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
