import { Role } from './userEntity'
import { Request, Response } from 'express'

export type UserContext = {
  id: number
  nickName: string
  picture: string
  role: Role
}

export interface MyContext {
  req: Request
  res: Response
  user?: UserContext
}
