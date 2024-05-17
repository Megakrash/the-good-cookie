import {
  User,
  UserCreateInput,
  UserLoginInput,
  UserUpdateInput,
  VerifyEmailResponse,
} from '../entities/User'
import { Picture } from '../entities/Picture'
import { validate } from 'class-validator'
import * as argon2 from 'argon2'
import {
  sendConfirmationEmail,
  sendVerificationEmail,
} from '../utils/mailServices/verificationEmail'
import { MyContext } from '../types/Users.types'
import { deletePicture } from '../utils/pictureServices/pictureServices'
import jwt from 'jsonwebtoken'
import Cookies from 'cookies'

export class UserServices {
  // Check if user already exists
  static async checkUserExists(email: string): Promise<void> {
    const existingUser = await User.findOne({ where: { email } })
    if (existingUser) {
      throw new Error('User already exists')
    }
  }
  // Create new user entity with picture & hash password
  static async createUserEntity(data: UserCreateInput): Promise<User> {
    const newUser = new User()
    Object.assign(newUser, data)

    if (data.pictureId) {
      const picture = await Picture.findOne({ where: { id: data.pictureId } })
      if (!picture) {
        throw new Error('Picture not found')
      }
      newUser.picture = picture
    }

    try {
      newUser.hashedPassword = await argon2.hash(data.password)
    } catch (error) {
      throw new Error(`Error hashing password: ${error}`)
    }

    return newUser
  }
  // Validate user
  static async validateUser(user: User): Promise<void> {
    const errors = await validate(user)
    if (errors.length > 0) {
      throw new Error(`Validation failed: ${JSON.stringify(errors)}`)
    }
  }
  // Send verification email
  static async sendVerification(
    email: string,
    nickName: string
  ): Promise<void> {
    await sendVerificationEmail(email, nickName)
  }
  // Find user by id
  static async findUserById(id: number): Promise<User> {
    const user = await User.findOne({ where: { id } })
    if (!user) {
      throw new Error('User not found')
    }
    return user
  }
  // Find picture by id
  static async findPictureById(id: number): Promise<Picture | null> {
    return await Picture.findOne({ where: { id } })
  }
  // Update user with new data
  static async updateUser(
    data: UserUpdateInput,
    user: User,
    context: MyContext
  ): Promise<User> {
    let oldPictureId: number | null = null
    if (data.ads) {
      data.ads = data.ads.map((entry) => {
        const existingRelation = user.ads.find(
          (ad) => ad.id === Number(entry.id)
        )
        return existingRelation || entry
      })
    }
    if (data.pictureId && user.picture?.id) {
      oldPictureId = user.picture.id
      const newPicture = await UserServices.findPictureById(data.pictureId)
      if (!newPicture) {
        throw new Error('New picture not found')
      }
      user.picture = newPicture
    }

    // Update user with new data
    Object.assign(user, data)
    if (context.user) {
      user.updatedBy = context.user
    }

    // Validate and save updated user
    await UserServices.validateUser(user)
    await user.save()
    if (oldPictureId) {
      await deletePicture(oldPictureId)
    }

    return (await User.findOne({
      where: { id: user.id },
      relations: {
        updatedBy: true,
      },
    })) as User
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
  // Update last connection
  static async updateLastConnection(user: User): Promise<void> {
    user.lastConnectionDate = new Date()
    await user.save()
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
  // Mark user as verified
  static async markUserAsVerified(email: string): Promise<VerifyEmailResponse> {
    const user = await User.findOneBy({ email })
    if (!user) {
      return { success: false, message: 'Utilisateur non trouvé' }
    }
    if (user.isVerified === true) {
      return { success: true, message: 'Email déjà vérifié' }
    }

    user.isVerified = true
    await user.save()
    await sendConfirmationEmail(user.email, user.nickName)
    return { success: true, message: 'Email vérifié avec succès !' }
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
