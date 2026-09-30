import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Request } from "express"
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { HUser, JwtPayload } from "../../user/types/user.type.js";
import { InjectModel } from "@nestjs/mongoose";
import { User } from "../models/user.model.js";
import { Model } from "mongoose";


declare module "express-serve-static-core" {
  interface Request {
    user: HUser
  }
}

@Injectable()
export class AuthGuard implements CanActivate{
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @InjectModel(User.name) private readonly userModel: Model<User>
  ){}
  async canActivate(context: ExecutionContext): Promise<boolean>{
    try{
    const req: Request = context.switchToHttp().getRequest()
    const authorization = req.headers.authorization
    if(!authorization || !authorization.startsWith("Bearer")){
      throw new UnauthorizedException()
    }
    const token = authorization.split(" ")[1]
    if(!token){
      throw new UnauthorizedException()
    }
    const payload = await this.jwtService.verifyAsync<JwtPayload>(token, {
      secret: this.configService.get<string>("TOKEN_SECERT")
    })
  
    const user = await this.userModel.findById(payload._id)

    if (!user){
      throw new UnauthorizedException()
    }
    if(!user.confirmedAt){
      throw new UnauthorizedException("Please verify your email first")
    }

    req.user = user

    return true
  } catch (e: any){
    throw new UnauthorizedException(e.message)
  }
  }
}