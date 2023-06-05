import {
  Catch,
  ArgumentsHost,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';

@Catch(HttpException)
export class AllExceptionsFilter extends BaseExceptionFilter {
  async catch(exception: any, host: ArgumentsHost) {
    console.log('Exception: ', exception, host.getArgs()?.toString());
    const ctx = host.switchToHttp();
    this.applicationRef.reply(
      ctx.getResponse(),
      exception?.response || {},
      exception?.response?.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
