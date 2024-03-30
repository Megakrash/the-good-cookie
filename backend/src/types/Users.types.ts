import { User } from '../entities/User'
import { Request, Response } from 'express'

export interface MyContext {
  req: Request
  res: Response
  user?: User
}

export enum Profil {
  PRO = 'PRO',
  INDIVIDUAL = 'INDIVIDUAL',
}

export enum Gender {
  MAN = 'MAN',
  WOMAN = 'WOMAN',
  OTHER = 'OTHER',
}

export enum Role {
  USER = 'USER',
  ADMIN = 'ADMIN',
}
