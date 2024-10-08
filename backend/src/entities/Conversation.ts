import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
  Unique,
} from 'typeorm'
import { Field, ID, InputType, ObjectType } from 'type-graphql'
import { User } from './User'
import { Message } from './Message'
import { Ad } from './Ad'
import { ObjectId } from './ObjectId'

@Entity()
@ObjectType()
@Unique(['id'])
export class Conversation extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id!: string

  // Relations
  @ManyToOne(() => User, (user) => user.conversations)
  @Field(() => User)
  user1!: User

  @ManyToOne(() => User, (user) => user.conversations)
  @Field(() => User)
  user2!: User

  @ManyToOne(() => Ad)
  @Field(() => Ad)
  ad!: Ad

  @OneToMany(() => Message, (message) => message.conversation)
  @Field(() => [Message])
  messages!: Message[]

  // Infos
  @CreateDateColumn({ type: 'timestamp' })
  @Field(() => Date)
  createdAt!: Date

  @UpdateDateColumn({ type: 'timestamp' })
  @Field(() => Date)
  updatedAt!: Date
}

@InputType()
export class ConversationCreateInput {
  @Field(() => ObjectId, { nullable: true })
  ad!: ObjectId

  @Field(() => ObjectId, { nullable: true })
  user2!: ObjectId
}
