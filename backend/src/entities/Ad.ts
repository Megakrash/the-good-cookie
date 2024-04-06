import { PrimaryEntity } from './PrimaryEntity'
import {
  ManyToOne,
  JoinColumn,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  Index,
  ManyToMany,
  JoinTable,
  OneToOne,
} from 'typeorm'
import { Length, IsInt, IsNumberString } from 'class-validator'
import { Field, ID, InputType, ObjectType, Int, Float } from 'type-graphql'
import { IsCoordinates } from '../utils/Coordinates'
import { SubCategory } from './SubCategory'
import { Tag } from './Tag'
import { User } from './User'
import { Picture } from './Picture'
import { ObjectId } from './ObjectId'

//-------------------------------
//--------- Ad Entity -----------
//-------------------------------
@Entity()
@ObjectType()
export class Ad extends PrimaryEntity {
  //------------ FIELDS -----------

  // ID
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id!: number

  // Title
  @Column({ length: 100 })
  @Length(10, 100, { message: 'Entre 10 et 100 caractères' })
  @Index()
  @Field()
  title!: string

  // Description
  @Column()
  @Field()
  description!: string

  // Price
  @Column()
  @IsInt()
  @Field()
  price!: number

  // ZipCode
  @Column({ length: 5, nullable: true })
  @IsNumberString(
    {},
    { message: 'Le code postal doit être une chaîne de chiffres' }
  )
  @Length(5, 5, { message: 'Le code postal doit avoir exactement 5 chiffres' })
  @Field()
  zipCode!: string

  // City
  @Column({ length: 50, nullable: true })
  @Length(3, 50, { message: 'Entre 3 et 50 caractères' })
  @Field()
  city!: string

  // Coordinates
  @Column('simple-array')
  @IsCoordinates({
    message:
      'Les coordonnées doivent être un tableau de deux éléments : latitude et longitude',
  })
  @Field(() => [Number])
  coordinates!: number[]

  // ---------- RELATIONS ----------

  // Picture
  @OneToOne(() => Picture, { nullable: true })
  @JoinColumn()
  @Field(() => Picture)
  picture!: Picture

  // SubCategory
  @ManyToOne(() => SubCategory, (subCategory) => subCategory.ads, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'subCategory' })
  @Field(() => SubCategory)
  subCategory!: SubCategory

  // User
  @ManyToOne(() => User, (user) => user.ads, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user' })
  @Field(() => User)
  user!: User

  // Tags
  @ManyToMany(() => Tag, (tag) => tag.ads)
  @JoinTable()
  @Field(() => [Tag])
  tags!: Tag[]
}

//-------------------------------
//--------- Ad Input ------------
//-------------------------------

@InputType()
export class AdCreateInput {
  @Field()
  title!: string

  @Field()
  description!: string

  @Field()
  price!: number

  @Field({ nullable: true })
  pictureId?: number

  @Field()
  zipCode!: string

  @Field()
  city!: string

  @Field(() => [Number])
  coordinates!: number[]

  @Field()
  subCategory!: ObjectId

  @Field(() => [ObjectId])
  tags!: ObjectId[]
}

//-------------------------------
//--------- Ad Update -----------
//-------------------------------

@InputType()
export class AdUpdateInput {
  @Field({ nullable: true })
  title!: string

  @Field({ nullable: true })
  description!: string

  @Field({ nullable: true })
  price!: number

  @Field({ nullable: true })
  pictureId?: number

  @Field({ nullable: true })
  zipCode!: string

  @Field({ nullable: true })
  city!: string

  @Field(() => [Number], { nullable: true })
  coordinates!: number[]

  @Field({ nullable: true })
  subCategory!: ObjectId

  @Field(() => [ObjectId], { nullable: true })
  tags!: ObjectId[]
}

//-------------------------------
//--------- Ad Location ---------
//-------------------------------

@InputType()
export class LocationInput {
  @Field(() => Float)
  latitude!: number

  @Field(() => Float)
  longitude!: number
}

//-------------------------------
//--------- Ad Search -----------
//-------------------------------

@InputType()
export class AdsWhere {
  @Field(() => [ID], { nullable: true })
  subCategory?: number[]

  @Field(() => String, { nullable: true })
  title?: string

  @Field(() => Int, { nullable: true })
  minPrice?: number

  @Field(() => Int, { nullable: true })
  maxPrice?: number

  @Field(() => LocationInput, { nullable: true })
  location?: LocationInput

  @Field(() => Int, { nullable: true })
  radius?: number

  @Field(() => [String], { nullable: true })
  tags?: string[]
}
