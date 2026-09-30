import { NestFactory } from '@nestjs/core';
import { AppModule, ObserveInstrument } from './app.module.js';
import { ConfigService } from '@nestjs/config';
import { StandardSchemaValidationPipe, ValidationPipe } from '@nestjs/common';
import { AppError } from './common/exceptions/error.handel.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    instrument: ObserveInstrument,
  });
  
  app.useGlobalFilters(new AppError)
  app.useGlobalPipes(new StandardSchemaValidationPipe())
  const config = app.get(ConfigService)
  await app.listen(config.get<number>("PORT") || 3000);
}
await bootstrap();
