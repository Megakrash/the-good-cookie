import jwt from 'jsonwebtoken'
import Cookies from 'cookies'
import { AuthChecker } from 'type-graphql'
import { MyContext } from './types/Users.types'
import { User } from './entities/User'

export const customAuthChecker: AuthChecker<MyContext> = async (
  { context },
  roles
): Promise<boolean> => {
  const cookie = new Cookies(context.req, context.res)
  const token = cookie.get('TGCookie')
  if (!token) {
    console.error('No Token')
    return false
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET_KEY || '')

    if (typeof payload === 'object' && 'userId' in payload) {
      const user = await User.findOne({
        where: { id: payload.userId },
      })
      if (user) {
        context.user = user
        return roles.length === 0 || roles.includes(user.role)
      }
      console.error('User not found')
      return false
    }
    console.error('Invalid token')
    return false
  } catch (error) {
    console.error('Invalid token')
    return false
  }
}
