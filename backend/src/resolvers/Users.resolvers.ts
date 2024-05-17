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

@Resolver(User)
export class UsersResolver {
  // CREATE
  @Mutation(() => User)
  async userCreate(
    @Arg('data', () => UserCreateInput) data: UserCreateInput
  ): Promise<User> {
    try {
      // Check if user already exists
      await UserServices.checkUserExists(data.email)

      // Create new user entity with picture & hash password
      const newUser = await UserServices.createUserEntity(data)

      // Validate user
      await UserServices.validateUser(newUser)

      // Save new user
      await UserServices.saveUser(newUser)

      // Send verification email
      await UserServices.sendVerification(newUser.email, newUser.nickName)

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
    @Arg('id', () => ID) id: number,
    @Ctx() context: MyContext
  ): Promise<User | null> {
    try {
      // Find user by id
      const user = await UserServices.findUserById(id)

      if (user.id === context.user?.id || context.user?.role === 'ADMIN') {
        // Update user with new data
        const updatedUser = await UserServices.updateUser(data, user, context)
        return updatedUser
      }
      return user
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
    const users = await User.find({})
    return users
  }

  // GET BY ID
  @Query(() => User)
  async userById(@Arg('id', () => ID) id: number): Promise<User> {
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
      const decoded = UserServices.decodeToken(token)
      if (decoded) {
        userEmail = decoded.email
        userNickName = decoded.nickName
      }

      const payload = UserServices.verifyToken(token)
      if (payload) {
        return await UserServices.markUserAsVerified(payload.email)
      }

      return { success: false, message: 'Invalid Token' }
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
      await UserServices.updateLastConnection(user)

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
  @Authorized('ADMIN', 'USER')
  @Query(() => UserContext)
  async meContext(@Ctx() context: MyContext): Promise<UserContext> {
    if (!context.user) {
      throw new Error('User not found')
    }

    const userContext = {
      id: context.user.id,
      nickName: context.user.nickName,
      picture: context.user.picture,
      role: context.user.role,
    }

    return userContext
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
    @Arg('id', () => ID) id: number
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
