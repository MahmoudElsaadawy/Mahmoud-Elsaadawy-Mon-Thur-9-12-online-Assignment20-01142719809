import { Controller, Get } from "@nestjs/common";
import { ChatService } from "./app.service.js";

@Controller("chat")
export class ChatController{
  constructor(private readonly chatService: ChatService){}
  @Get("hello")
  sayHello(){
    return this.chatService.sayHello()
  }
}