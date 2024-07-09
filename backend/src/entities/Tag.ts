import { PrimaryEntity } from './PrimaryEntity'
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  Index,
  ManyToMany,
  Unique,
} from 'typeorm'
import { Length } from 'class-validator'
import { Field, ID, InputType, ObjectType } from 'type-graphql'
import { Ad } from './Ad'

@Entity()
@ObjectType()
@Unique(['id'])
export class Tag extends PrimaryEntity {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id!: string

  @Column({ length: 100 })
  @Length(3, 50, { message: 'Entre 3 et 50 caractères' })
  @Index()
  @Field()
  name!: string

  @ManyToMany(() => Ad, (ad) => ad.tags)
  @Field(() => [Ad])
  ads!: Ad[]
}

@InputType()
export class TagCreateInput {
  @Field()
  name!: string
}

@InputType()
export class TagUpdateInput {
  @Field({ nullable: true })
  name!: string
}
