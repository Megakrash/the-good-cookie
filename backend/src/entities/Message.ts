import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  BaseEntity,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm'
import { Field, ID, InputType, ObjectType } from 'type-graphql'
import { ObjectId } from './ObjectId'
import { User } from './User'
import { Conversation } from './Conversation'
import { Ad } from './Ad'

//-------------------------------
//------ Message Entity --------
//-------------------------------

@Entity()
@ObjectType()
export class Message extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id!: number

  // Content
  @Column()
  @Field()
  content!: string

  // Relations
  @ManyToOne(() => Ad)
  @Field(() => Ad)
  ad!: Ad

  @ManyToOne(() => User, (user) => user.sentMessages)
  @Field(() => User)
  sender!: User

  @ManyToOne(() => User, (user) => user.receivedMessages)
  @Field(() => User)
  receiver!: User

  @ManyToOne(() => Conversation, (conversation) => conversation.messages)
  @JoinColumn()
  @Field(() => Conversation)
  conversation!: Conversation

  // Infos
  @CreateDateColumn({ type: 'timestamp' })
  @Field(() => Date)
  createdAt!: Date
}

//-------------------------------
//------ Message Input ----------
//-------------------------------

@InputType()
export class MessageCreateInput {
  @Field()
  content!: string

  @Field(() => ObjectId)
  ad!: ObjectId

  @Field(() => ObjectId)
  receiver!: ObjectId
}

//-------------------------------
// Message get conversation input
//-------------------------------

@InputType()
export class MessageGetConversationInput {
  @Field()
  adId!: number

  @Field(() => ObjectId)
  conversation?: ObjectId

  @Field()
  userId1!: number

  @Field()
  userId2!: number
}
