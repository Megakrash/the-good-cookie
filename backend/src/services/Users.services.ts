import {
  User,
  UserCreateInput,
  UserLoginInput,
  VerifyEmailResponse,
} from '../entities/User'
import { validate } from 'class-validator'
import * as argon2 from 'argon2'
import { sendVerificationEmail } from '../utils/mailServices/verificationEmail'
import { MyContext } from '../types/Users.types'
import { deletePicture } from '../utils/pictureServices/pictureServices'
import jwt from 'jsonwebtoken'
import Cookies from 'cookies'

export class UserServices {
  // ------------------------------
  // ------- FIND USER ------------
  // ------------------------------
  // Find user by id
  static async findUserById(id: number): Promise<User> {
    const user = await User.findOne({ where: { id } })
    if (!user) {
      throw new Error('User not found')
    }
    return user
  }
  // Find user by email
  static async findUserByEmail(email: string): Promise<User> {
    const user = await User.findOne({ where: { email } })
    if (!user) {
      throw new Error('User not found')
    }
    return user
  }
  // ------------------------------
  // ------- VALIDATE -------------
  // ------------------------------
  // Validate user
  static async validateUser(user: User): Promise<void> {
    const errors = await validate(user)
    if (errors.length > 0) {
      throw new Error(`Validation failed: ${JSON.stringify(errors)}`)
    }
  }
  // Validate password
  static async validatePassword(password: string): Promise<void> {
    const userInput = new UserCreateInput()
    userInput.password = password
    const errors = await validate(userInput)
    if (errors.length > 0) {
      throw new Error(`Validation failed: ${JSON.stringify(errors)}`)
    }
  }
  // ------------------------------
  // ----------- HASH -------------
  // ------------------------------
  // Hash password
  static async hashPassword(password: string): Promise<string> {
    const hashedPassword = await argon2.hash(password)
    return hashedPassword
  }
  // Check if email exist & if user is verified & if password is correct
  static async authenticateUser(data: UserLoginInput): Promise<User> {
    const user = await User.findOne({ where: { email: data.email } })
    if (!user) {
      throw new Error('Email ou mot de passe incorrect')
    }
    if (!user.isVerified) {
      throw new Error('Email non vérifié, consultez votre boite mail')
    }

    const valid = await argon2.verify(user.hashedPassword, data.password)
    if (!valid) {
      throw new Error('Email ou mot de passe incorrect')
    }

    return user
  }
  // Generate token
  static generateToken(user: User): string {
    return jwt.sign(
      {
        exp: Math.floor(Date.now() + 2 * 60 * 60 * 1000),
        userId: user.id,
      },
      process.env.JWT_SECRET_KEY || ''
    )
  }
  // Set cookie
  static setCookie(context: MyContext, token: string): void {
    const cookie = new Cookies(context.req, context.res)
    cookie.set('TGCookie', token, {
      httpOnly: true,
      secure: false,
      expires: new Date(Date.now() + 2 * 60 * 60 * 1000),
    })
  }
  // Decode token verifyEmail to get email & nickname
  static decodeToken(
    token: string
  ): { email: string; nickName: string } | null {
    const decodedToken = jwt.decode(token)
    if (
      typeof decodedToken === 'object' &&
      decodedToken &&
      'email' in decodedToken &&
      'nickName' in decodedToken
    ) {
      return { email: decodedToken.email, nickName: decodedToken.nickName }
    }
    return null
  }
  // Verify token
  static verifyToken(token: string): { email: string } | null {
    try {
      const payload = jwt.verify(
        token,
        process.env.JWT_VERIFY_EMAIL_SECRET_KEY || ''
      )
      if (typeof payload === 'object' && payload.email) {
        return { email: payload.email }
      }
    } catch (error) {
      return null
    }
    return null
  }
  // Handle expired token
  static async handleExpiredToken(
    email: string,
    nickName: string
  ): Promise<VerifyEmailResponse> {
    await sendVerificationEmail(email, nickName)
    return {
      success: false,
      message:
        'Le lien a expiré, un nouveau lien de vérification a été envoyé à votre adresse email.',
    }
  }
  // Delete user by id and his picture
  static async deleteUser(user: User, context: MyContext): Promise<string> {
    if (user.id !== context.user?.id && context.user?.role !== 'ADMIN') {
      throw new Error('Unauthorized')
    }

    const pictureId = user.picture?.id
    await user.remove()
    if (pictureId) {
      await deletePicture(pictureId)
    }
    return `User with id: ${user.id} deleted`
  }
}
