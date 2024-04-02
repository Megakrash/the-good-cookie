import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { Field, ID, InputType, ObjectType } from 'type-graphql'

@Entity()
@ObjectType()
export class Picture extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id!: number

  @CreateDateColumn({ type: 'timestamp' })
  @Field()
  createdAt!: Date

  @Column()
  @Field()
  filename!: string

  @Column({ nullable: true })
  @Field({ nullable: true })
  path!: string
}

@InputType()
export class PictureCreateInput {
  @Field()
  filename!: string

  @Field({ nullable: true })
  path!: string
}
