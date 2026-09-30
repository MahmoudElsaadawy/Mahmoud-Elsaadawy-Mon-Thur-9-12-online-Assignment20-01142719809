import { IsEmail, IsString } from "class-validator"

export class signupDTO {
  @IsString()
  name: string
  @IsEmail()
  email: string
  @IsString()
  password: string
}