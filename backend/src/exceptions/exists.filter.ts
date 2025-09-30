import {
  ExceptionFilter,
  Catch,
  HttpException,
  ArgumentsHost,
} from '@nestjs/common';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const status = exception.getStatus();
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const exceptionResponse = exception.getResponse();
    let errorMessage: string;

    if (typeof exceptionResponse === 'string') {
      errorMessage = exceptionResponse;
    } else if (typeof exceptionResponse === 'object') {
      const errorObj = exceptionResponse as any;
      if (Array.isArray(errorObj.message)) {
        errorMessage = errorObj.message
          .join(', ')
          .replace(/[a-zA-Z]+\.\d+\./gi, '');
      } else if (typeof errorObj.message === 'string') {
        errorMessage = errorObj.message;
      } else {
        errorMessage = 'Произошла ошибка';
      }
    } else {
      errorMessage = exception.message;
    }

    response.status(status).json({
      error: errorMessage,
    });
  }
}
