import { PrimaryEntity } from './PrimaryEntity'
import {
  OneToMany,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  Index,
  ManyToOne,
  JoinColumn,
  OneToOne,
} from 'typeorm'
import { Length } from 'class-validator'
import { Field, ID, InputType, ObjectType } from 'type-graphql'
import { Ad } from './Ad'
import { Category } from './Category'
import { ObjectId } from './ObjectId'
import { Picture } from './Picture'

//-------------------------------
//------ SubCategory Entity -----
//-------------------------------

@Entity()
@ObjectType()
export class SubCategory extends PrimaryEntity {
  //------------ FIELDS -----------

  // ID
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id!: number

  // Name
  @Column({ length: 50 })
  @Length(3, 50, { message: 'Entre 3 et 50 caractères' })
  @Index()
  @Field()
  name!: string

  // ---------- RELATIONS ----------

  // Picture
  @OneToOne(() => Picture, { cascade: true, nullable: true })
  @JoinColumn()
  @Field(() => Picture, { nullable: true })
  picture!: Picture

  // Ads
  @OneToMany(() => Ad, (ad) => ad.subCategory)
  @Field(() => [Ad])
  ads!: Ad[]

  // Category
  @ManyToOne(() => Category, (Category) => Category.subCategories, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'category' })
  @Field(() => Category)
  category!: Category
}

//-------------------------------
//------ SubCategory Input ------
//-------------------------------

@InputType()
export class SubCategoryCreateInput {
  @Field()
  name!: string

  @Field({ nullable: true })
  pictureId?: number

  @Field(() => ObjectId)
  category!: ObjectId
}

//-------------------------------
//------ SubCategory Update -----
//-------------------------------

@InputType()
export class SubCategoryUpdateInput {
  @Field({ nullable: true })
  name!: string

  @Field({ nullable: true })
  pictureId?: number

  @Field(() => ObjectId, { nullable: true })
  category!: ObjectId
}
