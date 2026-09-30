import z from "zod"
import { GenderEnum } from "./types/user.type.js"

export const signupSchema = z.strictObject({
  name: z.string(),
  password: z.string().regex(new RegExp(/^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*([\W])).{8,}$/)),
  email: z.email(),
  age: z.number().optional(),
  bio: z.string().optional(),
  gender: z.enum(Object.values(GenderEnum)),
  phone: z.string().optional()
})
export type signupSchemaDTO = z.infer<typeof signupSchema>

export const confirmEmailSchema = z.strictObject({
  email: z.email(),
  otp: z.string().length(6)
})
export type confirmEmailDTO = z.infer<typeof confirmEmailSchema>

export const loginSchema = z.strictObject({
  email: z.email(),
  password: z.string()
})
export type loginSchemaDTO = z.infer<typeof loginSchema>
