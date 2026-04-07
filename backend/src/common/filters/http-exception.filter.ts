import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

type ErrorBody = {
  message: string | string[];
  error?: string;
};

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    const request = context.getRequest<Request>();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const errorBody = this.buildErrorBody(exception, status);

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      ...errorBody,
    });
  }

  private buildErrorBody(exception: unknown, status: number): ErrorBody {
    if (!(exception instanceof HttpException)) {
      return {
        message: 'Internal server error',
        error: HttpStatus[status],
      };
    }

    const exceptionResponse = exception.getResponse();

    if (typeof exceptionResponse === 'string') {
      return {
        message: exceptionResponse,
        error: HttpStatus[status],
      };
    }

    if (
      typeof exceptionResponse === 'object' &&
      exceptionResponse !== null &&
      'message' in exceptionResponse
    ) {
      const responseBody = exceptionResponse as ErrorBody;

      return {
        message: responseBody.message,
        error:
          responseBody.error ??
          (typeof responseBody.message === 'string'
            ? responseBody.message
            : HttpStatus[status]),
      };
    }

    return {
      message: exception.message,
      error: HttpStatus[status],
    };
  }
}
