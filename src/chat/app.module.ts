import { Module } from "@nestjs/common";
import { ChatController } from "./app.controller.js";
import { ChatService } from "./app.service.js";


@Module({
  controllers: [ChatController],
  providers: [ChatService],
})
export class ChatModule {

}