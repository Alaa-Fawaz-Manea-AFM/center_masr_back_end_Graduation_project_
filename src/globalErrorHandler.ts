import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse();

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const response = exception.getResponse();

      return res.status(status).json({
        status: (response as any)?.status || (status < 500 ? 'fail' : 'error'),
        message: (response as any)?.message || exception.message,
      });
    }

    return res.status(500).json({
      status: 'error',
      message: 'Something went wrong',
    });
  }
}
