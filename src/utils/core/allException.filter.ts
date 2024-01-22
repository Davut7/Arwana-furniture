import {
  ArgumentsHost,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import {
  CustomHttpExceptionResponse,
  HttpExceptionResponse,
} from './httpExceptionResponse.interface';
import * as fs from 'fs';
import { Request } from 'express';

export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger('HTTP-exception');
  catch(exception: any, host: ArgumentsHost): any {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status: HttpStatus;
    let errorMessage: string;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const errorResponse = exception.getResponse();

      errorMessage =
        `${exception.message}. ` + JSON.stringify(errorResponse, null, 2);
    } else {
      let errorResponse;
      errorMessage =
        (errorResponse as HttpExceptionResponse).message || exception.message;
    }
  }

  private getErrorResponse = (
    status: HttpStatus,
    errorMessage: string,
    request: Request,
  ): CustomHttpExceptionResponse => ({
    statusCode: status,
    message: `${errorMessage} ${status === 404 ? `(Path not found)` : ''}`,
    path: request.url,
    method: request.method,
    timeStamp: new Date(),
  });

  private getErrorLog(
    errorResponse: CustomHttpExceptionResponse,
    request: Request,
    exception: unknown,
  ) {
    const { statusCode, message } = errorResponse;
    const { method, originalUrl, hostname } = request;

    let host;
    let incomingMessage;
    if (request.headers['x-real-ip'] === hostname) {
      host = 'localhost';
      incomingMessage = 'Internal request';
    } else {
      host = request.headers['x-real-ip'] || '';
      incomingMessage = 'External request';
    }
    this.logger.error(
      message,
      [host, originalUrl, statusCode, method],
      //   JSON.stringify(request.user ?? 'Not signed in', null, 2),
    );
  }

  private writeErrorLogToFile = (errorLog: string) => {
    fs.appendFile(__dirname + './logs/errorLog', errorLog, 'utf8', (err) => {
      if (err) throw err;
    });
  };
}
