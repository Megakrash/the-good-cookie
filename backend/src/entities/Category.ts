import { PrimaryEntity } from './PrimaryEntity'
import {
  OneToMany,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToOne,
  JoinColumn,
} from 'typeorm'
import { Field, ID, InputType, ObjectType } from 'type-graphql'
import { ObjectId } from './ObjectId'
import { Picture } from './Picture'
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

  // Picture
  @OneToOne(() => Picture, { cascade: true, nullable: true })
  @JoinColumn()
  @Field(() => Picture, { nullable: true })
  picture!: Picture

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

  @Field({ nullable: true })
  pictureId?: number

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

  @Field({ nullable: true })
  pictureId?: number

  @Field(() => ObjectId, { nullable: true })
  parentCategory!: ObjectId

  @Field(() => [ObjectId], { nullable: true })
  childCategories!: ObjectId[]
}
