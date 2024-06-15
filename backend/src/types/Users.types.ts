import { User } from '../entities/User'
import { Request, Response } from 'express'

export interface MyContext {
  req: Request
  res: Response
  user?: User
}

export enum ProfilEnum {
  PRO = 'PRO',
  INDIVIDUAL = 'INDIVIDUAL',
}

export enum GenderEnum {
  MAN = 'MAN',
  WOMAN = 'WOMAN',
  OTHER = 'OTHER',
}

export enum RoleEnum {
  USER = 'USER',
  ADMIN = 'ADMIN',
}
