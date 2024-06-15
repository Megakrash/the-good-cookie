import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  BaseEntity,
  CreateDateColumn,
} from 'typeorm'
import { Field, ID, InputType, ObjectType } from 'type-graphql'
import { ObjectId } from './ObjectId'
import { User } from './User'

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

  // Ad
  @Column()
  @Field(() => ID)
  adId!: number

  // Relations
  @ManyToOne(() => User, (user) => user.sentMessages)
  @Field(() => User)
  sender!: User

  @ManyToOne(() => User, (user) => user.receivedMessages)
  @Field(() => User)
  receiver!: User

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

  @Field()
  adId!: number

  @Field(() => ObjectId, { nullable: true })
  sender!: ObjectId

  @Field(() => ObjectId, { nullable: true })
  receiver!: ObjectId
}

//-------------------------------
// Message get conversation input
//-------------------------------

@InputType()
export class MessageConversationInput {
  @Field()
  adId!: number

  @Field()
  userId1!: number

  @Field()
  userId2!: number
}
