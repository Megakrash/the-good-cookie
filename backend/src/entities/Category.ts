import {
  BaseEntity,
  OneToMany,
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { Field, ID, InputType, ObjectType } from 'type-graphql'
import { SubCategory } from './SubCategory'
import { ObjectId } from './ObjectId'

@Entity()
@ObjectType()
export class Category extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id!: number

  @Column({ length: 100 })
  @Field()
  name!: string

  @OneToMany(() => SubCategory, (subCategories) => subCategories.category)
  @Field(() => [SubCategory])
  subCategories!: SubCategory[]
}

@InputType()
export class CategoryCreateInput {
  @Field()
  name!: string
}

@InputType()
export class CategoryUpdateInput {
  @Field({ nullable: true })
  name!: string

  @Field(() => [ObjectId], { nullable: true })
  subCategory!: ObjectId[]
}
