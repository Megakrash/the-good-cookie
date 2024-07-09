import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm'
import { User } from './User'

@Entity()
@Unique(['id'])
export class UserToken extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column()
  token!: string

  @ManyToOne(() => User)
  user!: User

  @CreateDateColumn()
  expiresAt!: Date

  @CreateDateColumn()
  createdAt!: Date
}
