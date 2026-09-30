import { Injectable } from "@nestjs/common";

@Injectable()
export class ChatService {
  sayHello(){
    return {
      data: {
        msg: "Hello from chat module"
      }
    }
  }
}