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
  Unique,
} from 'typeorm'
import { Length, IsInt, IsNumberString } from 'class-validator'
import { Field, ID, InputType, ObjectType, Int } from 'type-graphql'
import { Tag } from './Tag'
import { User } from './User'
import { ObjectId } from './ObjectId'
import { PointInput, PointType } from './Geolocation'
import { Category } from './Category'

//-------------------------------
//--------- Ad Entity -----------
//-------------------------------
@Entity()
@ObjectType()
@Unique(['id'])
export class Ad extends PrimaryEntity {
  //------------ FIELDS -----------

  // ID
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id!: string

  // Title
  @Column({ length: 100 })
  @Length(4, 100, { message: 'Entre 4 et 100 caractères' })
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

  // Location
  @Column({
    type: 'geometry',
    spatialFeatureType: 'Point',
    srid: 4326,
  })
  @Field(() => PointType)
  location!: {
    type: 'Point'
    coordinates: [number, number]
  }

  // Picture
  @Column({ length: 100 })
  @Length(4, 200, { message: 'Entre 4 et 100 caractères' })
  @Field({ nullable: true })
  picture!: string

  // ---------- RELATIONS ----------

  // Category
  @ManyToOne(() => Category, (Category) => Category.ads, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'category' })
  @Field(() => Category)
  category!: Category

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

  @Field()
  zipCode!: string

  @Field()
  city!: string

  @Field(() => PointInput)
  location!: PointInput

  @Field({ nullable: true })
  picture!: string

  @Field()
  category!: ObjectId

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
  zipCode!: string

  @Field({ nullable: true })
  city!: string

  @Field(() => PointInput, { nullable: true })
  location?: PointInput

  @Field({ nullable: true })
  picture!: string

  @Field({ nullable: true })
  category!: ObjectId

  @Field(() => [ObjectId], { nullable: true })
  tags!: ObjectId[]
}

//-------------------------------
//--------- Ad Search -----------
//-------------------------------

@InputType()
export class AdsWhere {
  @Field(() => [ID], { nullable: true })
  category?: number[]

  @Field(() => String, { nullable: true })
  title?: string

  @Field(() => Int, { nullable: true })
  minPrice?: number

  @Field(() => Int, { nullable: true })
  maxPrice?: number

  @Field(() => PointInput, { nullable: true })
  location?: PointInput

  @Field(() => Int, { nullable: true })
  radius?: number

  @Field(() => [String], { nullable: true })
  tags?: string[]
}
