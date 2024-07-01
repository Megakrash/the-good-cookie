import { PrimaryEntity } from './PrimaryEntity'
import {
  OneToMany,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
} from 'typeorm'
import { Field, ID, InputType, ObjectType } from 'type-graphql'
import { ObjectId } from './ObjectId'
import { Ad } from './Ad'

//-------------------------------
//------ Category Entity --------
//-------------------------------

@Entity()
@ObjectType()
export class Category extends PrimaryEntity {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id!: number

  // Name
  @Column({ length: 100 })
  @Field()
  name!: string

  // Display
  @Column({ nullable: true, default: false })
  @Field(() => Boolean, { nullable: true })
  display!: boolean

  // Picture
  @Column({ length: 150, nullable: true })
  @Field({ nullable: true })
  picture!: string

  // Ads
  @OneToMany(() => Ad, (ad) => ad.category)
  @Field(() => [Ad])
  ads!: Ad[]

  // ParentCategory
  @ManyToOne(() => Category, (category) => category.childCategories, {
    nullable: true,
  })
  @Field(() => Category, { nullable: true })
  parentCategory?: Category

  // SubCategories
  @OneToMany(() => Category, (category) => category.parentCategory, {
    cascade: true,
  })
  @Field(() => [Category], { nullable: true })
  childCategories?: Category[]
}

//-------------------------------
//------ Category Input ---------
//-------------------------------

@InputType()
export class CategoryCreateInput {
  @Field()
  name!: string

  @Field(() => Boolean, { nullable: true })
  display!: boolean

  @Field({ nullable: true })
  picture!: string

  @Field(() => ObjectId, { nullable: true })
  parentCategory!: ObjectId
}

//-------------------------------
//------ Category Update --------
//-------------------------------

@InputType()
export class CategoryUpdateInput {
  @Field({ nullable: true })
  name!: string

  @Field(() => Boolean, { nullable: true })
  display!: boolean

  @Field({ nullable: true })
  picture!: string

  @Field(() => ObjectId, { nullable: true })
  parentCategory!: ObjectId

  @Field(() => [ObjectId], { nullable: true })
  childCategories!: ObjectId[]
}
