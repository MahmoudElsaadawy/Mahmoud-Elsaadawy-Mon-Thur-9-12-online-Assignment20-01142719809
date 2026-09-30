import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class AppError implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const http = host.switchToHttp();
    const req = http.getRequest();
    const res: Response = http.getResponse();
    const status = exception.getStatus();

    Logger.warn(exception.stack)
    res
      .status(exception.getStatus())
      .json({
        error: (exception.getResponse() as any).message,
        statusCode: status,
      });
  }
}
