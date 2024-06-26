import { buildSchema } from 'type-graphql'
import { AdsResolver } from './resolvers/Ads.resolvers'
import { CategoriesResolver } from './resolvers/Categories.resolvers'
import { TagsResolver } from './resolvers/Tags.resolvers'
import { UsersResolver } from './resolvers/Users.resolvers'
import { MessagesResolver } from './resolvers/Messages.resolvers'
import { ConversationsResolver } from './resolvers/Conversations.resolvers'
import { customAuthChecker } from './auth'
import { pubSub } from './pubSub'

export async function getSchema() {
  const schema = await buildSchema({
    resolvers: [
      AdsResolver,
      UsersResolver,
      CategoriesResolver,
      TagsResolver,
      MessagesResolver,
      ConversationsResolver,
    ],
    authChecker: customAuthChecker,
    pubSub: pubSub,
  })
  return schema
}
