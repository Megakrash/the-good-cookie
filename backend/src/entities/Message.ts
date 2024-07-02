import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  BaseEntity,
  CreateDateColumn,
  JoinColumn,
  Unique,
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
@Unique(['id'])
export class Message extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id!: string

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
  @Field(() => ObjectId, { nullable: true })
  ad?: ObjectId

  @Field(() => ObjectId, { nullable: true })
  conversation?: ObjectId

  @Field({ nullable: true })
  userId1?: string

  @Field({ nullable: true })
  userId2?: string
}
