import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MessageService } from './message.service.js';

@Controller('message')
export class MessageController {
  constructor(
    private readonly messageService: MessageService,
    private readonly config: ConfigService
  ){}
  @Get(":id")
  test(@Param("id", ParseIntPipe) id: Request) {
    return {
      data: {
        msg: "hello from message module",
        port: this.config.get("PORT")
      }
    }
  }
}
