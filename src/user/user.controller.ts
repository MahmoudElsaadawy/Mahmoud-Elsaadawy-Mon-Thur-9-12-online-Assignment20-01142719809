import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Post,
  Query,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service.js';
import { MyPipe } from '../common/pipes/pipe.js';
import { type confirmEmailDTO, confirmEmailSchema, loginSchema, type loginSchemaDTO, signupSchema, type signupSchemaDTO } from './user.validation.js';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '../common/guards/auth.guard.js';
import { type Request } from "express"
import { type HUser } from './types/user.type.js';
import { User } from '../common/decorators/user.decorator.js';

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly config: ConfigService,
  ) {}

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  async signup(
    @Body({
      schema: signupSchema,
    })
    body: signupSchemaDTO,
  ) {
    return this.userService.signup(body);
  }
  
  @Post("confirm-email")
  async confirmEmail(@Body({
    schema: confirmEmailSchema
  }) body:confirmEmailDTO){
    await this.userService.confirmEmail(body)
    return {
      data: "Email verified successfully"
    }
  }

  @Post("login")
  async login(@Body({
    schema: loginSchema
  }) body: loginSchemaDTO){
    const data = await this.userService.login(body)
    return {
      data
    }
  }

  @Get("")
  async getAllUsers(){
    return {
      data: await this.userService.getAll()
    }
  }

  @Get("me")
  @UseGuards(AuthGuard)
  getProfile(@User() user: HUser){
    return {
      data: {user}
    }
  }
}
