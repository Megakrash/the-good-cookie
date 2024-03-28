import { User } from './User'
import {
  BaseEntity,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm'
import { Field, ObjectType } from 'type-graphql'

@ObjectType()
export abstract class PrimaryEntity extends BaseEntity {
  @ManyToOne(() => User)
  @JoinColumn({ name: 'createdBy' })
  @Field(() => User, { nullable: true })
  createdBy!: User

  @ManyToOne(() => User)
  @JoinColumn({ name: 'updatedBy' })
  @Field(() => User, { nullable: true })
  updatedBy!: User

  @CreateDateColumn({ type: 'timestamp' })
  @Field()
  createdAt!: Date

  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  @Field({ nullable: true })
  updatedAt!: Date
}
