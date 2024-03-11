import { buildSchema } from 'type-graphql'
import { AdsResolver } from './resolvers/Ads'
import { CategoriesResolver } from './resolvers/Categories'
import { PictureResolver } from './resolvers/Pictures'
import { SubCategoriesResolver } from './resolvers/SubCategories'
import { TagsResolver } from './resolvers/Tags'
import { UsersResolver } from './resolvers/Users'
import { customAuthChecker } from './auth'

export async function getSchema() {
  const schema = await buildSchema({
    resolvers: [
      AdsResolver,
      UsersResolver,
      PictureResolver,
      CategoriesResolver,
      SubCategoriesResolver,
      TagsResolver,
    ],
    authChecker: customAuthChecker,
  })
  return schema
}
