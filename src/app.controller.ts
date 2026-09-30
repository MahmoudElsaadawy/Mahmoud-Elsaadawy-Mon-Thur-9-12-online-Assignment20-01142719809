import { Controller, Get, UsePipes } from '@nestjs/common';
import { AppService } from './app.service.js';
import { MyPipe } from './common/pipes/pipe.js';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
