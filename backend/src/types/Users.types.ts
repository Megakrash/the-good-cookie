import { User } from '../entities/User'
import { Request, Response } from 'express'
import { WebSocket } from 'ws'

export interface MyContext {
  req: Request
  res: Response
  ws: WebSocket
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
