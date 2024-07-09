import { DataSource } from 'typeorm'
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions'
import { Ad } from './entities/Ad'
import { Category } from './entities/Category'
import { Conversation } from './entities/Conversation'
import { Message } from './entities/Message'
import { PrimaryEntity } from './entities/PrimaryEntity'
import { Tag } from './entities/Tag'
import { ObjectId } from './entities/ObjectId'
import { User } from './entities/User'
import { UserToken } from './entities/UserToken'

export const dataSourceOptions: PostgresConnectionOptions = {
  type: 'postgres',
  entities: [
    Ad,
    Category,
    Conversation,
    Message,
    PrimaryEntity,
    Tag,
    ObjectId,
    User,
    UserToken,
  ],
  synchronize: process.env.DATASOURCE_SYNCHRONIZE === 'true' ? true : false,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  logging: process.env.DOCKER_LOGS === 'true' ? true : false,
}

export const dataSource = new DataSource({
  ...dataSourceOptions,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
})
