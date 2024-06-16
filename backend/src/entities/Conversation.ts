import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
} from 'typeorm'
import { Field, ID, ObjectType } from 'type-graphql'
import { User } from './User'
import { Message } from './Message'
import { Ad } from './Ad'

@Entity()
@ObjectType()
export class Conversation extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id!: number

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
