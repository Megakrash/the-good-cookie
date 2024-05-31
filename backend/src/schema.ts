import { buildSchema } from 'type-graphql'
import { AdsResolver } from './resolvers/Ads.resolvers'
import { CategoriesResolver } from './resolvers/Categories.resolvers'
import { PictureResolver } from './resolvers/Pictures.resolvers'
import { TagsResolver } from './resolvers/Tags.resolvers'
import { UsersResolver } from './resolvers/Users.resolvers'
import { customAuthChecker } from './auth'

export async function getSchema() {
  const schema = await buildSchema({
    resolvers: [
      AdsResolver,
      UsersResolver,
      PictureResolver,
      CategoriesResolver,
      TagsResolver,
    ],
    authChecker: customAuthChecker,
  })
  return schema
}
