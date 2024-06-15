import { buildSchema } from 'type-graphql'
import { AdsResolver } from './resolvers/Ads.resolvers'
import { CategoriesResolver } from './resolvers/Categories.resolvers'
import { PictureResolver } from './resolvers/Pictures.resolvers'
import { TagsResolver } from './resolvers/Tags.resolvers'
import { UsersResolver } from './resolvers/Users.resolvers'
import { MessagesResolver } from './resolvers/Messages.resolvers'
import { customAuthChecker } from './auth'
import { pubSub } from './pubSub'

export async function getSchema() {
  const schema = await buildSchema({
    resolvers: [
      AdsResolver,
      UsersResolver,
      PictureResolver,
      CategoriesResolver,
      TagsResolver,
      MessagesResolver,
    ],
    authChecker: customAuthChecker,
    pubSub: pubSub,
  })
  return schema
}
