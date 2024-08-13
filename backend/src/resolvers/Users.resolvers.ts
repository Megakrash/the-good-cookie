import {
  Arg,
  Query,
  Resolver,
  Mutation,
  Ctx,
  Authorized,
  ID,
} from 'type-graphql'
import jwt from 'jsonwebtoken'
import Cookies from 'cookies'
import { MyContext } from '../types/Users.types'
import {
  MeUser,
  User,
  UserContext,
  UserCreateInput,
  UserLoginInput,
  UserUpdateInput,
  VerifyEmailResponse,
} from '../entities/User'
import { UserServices } from '../services/Users.services'
import { UserToken } from '../entities/UserToken'
import { addDays, isBefore } from 'date-fns'
import { v4 as uuidv4 } from 'uuid'
import { resetPasswordEmail } from '../utils/mailServices/resetPasswordEmail'
import {
  sendConfirmationEmail,
  sendVerificationEmail,
} from '../utils/mailServices/verificationEmail'
import { deletePicture } from '../utils/picturesServices/deletePicture'

@Resolver(User)
export class UsersResolver {
  // CREATE
  @Mutation(() => User)
  async userCreate(
    @Arg('data', () => UserCreateInput) data: UserCreateInput
  ): Promise<User> {
    try {
      // Check if user already exists
      const userAlreadyExist = await User.findOne({
        where: { email: data.email },
      })
      if (userAlreadyExist) {
        throw new Error('User already exists')
      }

      const newUser = new User()
      Object.assign(newUser, data)
      newUser.updatedBy = newUser
      newUser.createdBy = newUser

      // Hash password
      newUser.hashedPassword = await UserServices.hashPassword(data.password)

      // Validate user
      await UserServices.validateUser(newUser)

      // Save new user
      await newUser.save()

      // Send verification email
      await sendVerificationEmail(newUser.email, newUser.nickName)

      return newUser
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message)
      } else {
        throw new Error('An unknown error occurred')
      }
    }
  }

  // UPDATE
  @Authorized('ADMIN', 'USER')
  @Mutation(() => User, { nullable: true })
  async userUpdate(
    @Arg('data') data: UserUpdateInput,
    @Arg('id', () => ID) id: string,
    @Ctx() context: MyContext
  ): Promise<User | null> {
    try {
      // Find user by id
      const user = await UserServices.findUserById(id)

      // Check if user is authorized to update
      if (user.id !== context.user?.id || context.user?.role !== 'ADMIN') {
        throw new Error('Unauthorized')
      }

      if (data.picture && data.picture !== user.picture) {
        await deletePicture(user.picture)
      }

      // Update user with his ads
      if (data.ads) {
        data.ads = data.ads.map((entry) => {
          const existingRelation = user.ads.find((ad) => ad.id === entry.id)
          return existingRelation || entry
        })
      }

      // Update user with new data
      Object.assign(user, data)
      if (context.user) {
        user.updatedBy = context.user
      }
      // Validate user
      await UserServices.validateUser(user)
      // Save user
      await user.save()

      // Return updated user
      const userUpdated = await UserServices.findUserById(id)

      return userUpdated
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message)
      } else {
        throw new Error('An unknown error occurred')
      }
    }
  }

  // GET ALL
  @Authorized('ADMIN')
  @Query(() => [User])
  async usersGetAll(): Promise<User[]> {
    const users = await User.find({
      relations: { updatedBy: true, createdBy: true },
    })
    return users
  }

  // GET BY ID
  @Query(() => User)
  async userById(@Arg('id', () => ID) id: string): Promise<User> {
    const user = await User.findOne({
      where: { id },
      relations: {
        createdBy: true,
        updatedBy: true,
      },
    })
    if (!user) {
      throw new Error('User not found')
    }
    return user
  }

  // VERIFY EMAIL
  @Mutation(() => VerifyEmailResponse)
  async verifyEmail(@Arg('token') token: string): Promise<VerifyEmailResponse> {
    let userEmail: string | null = null
    let userNickName: string | null = null

    try {
      // Decode token
      const decoded = UserServices.decodeToken(token)
      if (decoded) {
        userEmail = decoded.email
        userNickName = decoded.nickName
      }
      // Verify token
      const payload = UserServices.verifyToken(token)
      if (!payload) {
        return { success: false, message: 'Invalid Token' }
      }
      // Find user by email
      const user = await UserServices.findUserByEmail(payload.email)
      if (!user) {
        return { success: false, message: 'Utilisateur non trouvé' }
      }
      if (user.isVerified === true) {
        return { success: true, message: 'Email déjà vérifié' }
      }
      // Mark user as verified
      user.isVerified = true
      // Save user
      await user.save()
      // Send confirmation email
      await sendConfirmationEmail(user.email, user.nickName)
      return { success: true, message: 'Email vérifié avec succès !' }
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError && userEmail && userNickName) {
        return await UserServices.handleExpiredToken(userEmail, userNickName)
      }
      return { success: false, message: `Erreur de la vérification de l'email` }
    }
  }

  // SIGNIN
  @Mutation(() => User)
  async userLogin(
    @Ctx() context: MyContext,
    @Arg('data', () => UserLoginInput) data: UserLoginInput
  ): Promise<User> {
    try {
      // Authenticate user
      const user = await UserServices.authenticateUser(data)

      // Generate token
      const token = UserServices.generateToken(user)

      // Set cookie
      UserServices.setCookie(context, token)

      // Update last connection date
      user.lastConnectionDate = new Date()

      // Save user
      await user.save()

      return user
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message)
      } else {
        throw new Error('An unknown error occurred')
      }
    }
  }

  // ME
  @Authorized('ADMIN', 'USER')
  @Query(() => MeUser)
  async me(@Ctx() context: MyContext): Promise<MeUser | null> {
    if (!context.user) {
      throw new Error('User not found')
    }

    const meUser = {
      id: context.user.id,
      email: context.user.email,
      profil: context.user.profil,
      gender: context.user.gender,
      firstName: context.user.firstName,
      lastName: context.user.lastName,
      nickName: context.user.nickName,
      adress: context.user.adress,
      zipCode: context.user.zipCode,
      city: context.user.city,
      phoneNumber: context.user.phoneNumber,
      role: context.user.role,
      createdAt: context.user.createdAt,
      updatedAt: context.user.updatedAt,
      updatedBy: context.user.updatedBy,
      lastConnectionDate: context.user.lastConnectionDate,
      picture: context.user.picture,
      ads: context.user.ads,
    }

    return meUser
  }

  // ME CONTEXT FOR FRONTEND
  @Query(() => UserContext, { nullable: true })
  async meContext(@Ctx() context: MyContext): Promise<UserContext | null> {
    // Get if cookie is present in context
    const cookies = new Cookies(context.req, context.res)
    const TGCookie = cookies.get('TGCookie')

    if (!TGCookie) {
      return null
    }

    try {
      // Verify token
      const payload = jwt.verify(TGCookie, process.env.JWT_SECRET_KEY || '')
      // Get user from payload
      if (typeof payload === 'object' && 'userId' in payload) {
        const user = await UserServices.findUserById(payload.userId)
        // if user is found, return user context
        if (user) {
          const userContext = {
            id: user.id,
            nickName: user.nickName,
            picture: user.picture,
            role: user.role,
          }
          return userContext
        } else {
          return null
        }
      }
    } catch (err) {
      console.error('Error verifying token:', err)
      return null
    }

    return null
  }

  // FORGOT PASSWORD
  @Mutation(() => Boolean)
  async resetPassword(
    @Arg('email') email: string,
    @Ctx() context: MyContext
  ): Promise<boolean> {
    const cookies = new Cookies(context.req, context.res)
    const renthub_token = cookies.get('TGCookie')
    // If token is present, throw error
    if (renthub_token) {
      throw new Error('already connected')
    }
    // Find user by email
    const user = await User.findOne({ where: { email } })
    if (!user) {
      return true
    }

    // Generate & save token
    const token = new UserToken()
    token.user = user
    token.createdAt = new Date()
    token.expiresAt = addDays(new Date(), 1)
    token.token = uuidv4()

    await token.save()

    // Send email
    await resetPasswordEmail(user.email, user.nickName, token)

    return true
  }

  // RESET PASSWORD
  @Mutation(() => Boolean)
  async setPassword(
    @Arg('token') token: string,
    @Arg('password') password: string
  ): Promise<boolean> {
    // Find token + user
    const userToken = await UserToken.findOne({
      where: { token },
      relations: { user: true },
    })

    if (!userToken) {
      throw new Error('invalid token')
    }

    // check token validity
    if (isBefore(new Date(userToken.expiresAt), new Date())) {
      throw new Error('expired token')
    }

    // Check new password validity
    await UserServices.validatePassword(password)

    // Hash password
    userToken.user.hashedPassword = await UserServices.hashPassword(password)

    // Save user
    await userToken.user.save()

    // Remove token
    await userToken.remove()

    return true
  }

  // SIGNOUT
  @Mutation(() => Boolean)
  async userSignOut(@Ctx() context: MyContext): Promise<boolean> {
    const cookie = new Cookies(context.req, context.res)
    cookie.set('TGCookie', '', {
      httpOnly: true,
      secure: false,
      maxAge: 0,
    })
    return true
  }

  // DELETE
  @Authorized('ADMIN', 'USER')
  @Mutation(() => String)
  async userDelete(
    @Ctx() context: MyContext,
    @Arg('id', () => ID) id: string
  ): Promise<string> {
    try {
      const user = await UserServices.findUserById(id)
      return await UserServices.deleteUser(user, context)
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message)
      } else {
        throw new Error('An unknown error occurred')
      }
    }
  }
}
