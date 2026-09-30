import { HydratedDocument, Types } from "mongoose"

export enum GenderEnum {
  male = "0",
  female = "1"
}

export enum ProviderEnum {
  system,
  google,
}

export enum RoleEnum {
  user,
  admin,
}

export interface IUser{
  name: string
  email: string
  password: string
  phone: string
  age: number
  gender: GenderEnum
  isOnline?: boolean
  isActive?: boolean
  confirmedAt: Date
  changedCredentialsAt: Date
  provider: ProviderEnum
  role: RoleEnum
  profilePic: string
  coverPics: string[]
  bio?: string
  createdAt?:Date,
  updatedAt?:Date,
}

export type HUser = HydratedDocument<IUser>

export interface JwtPayload{
  iat: number,
  exp?: number,
  email: string,
  _id: Types.ObjectId
}