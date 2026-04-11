import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import { ThrottlerModule } from '@nestjs/throttler';
import { nanoid } from 'nanoid';
import { WinstonConfig } from './utils/logger';
import { GlobalExceptionFilter } from './globalErrorHandler';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonConfig,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  app.setGlobalPrefix('api/v1');
  app.enableShutdownHooks();
  app.useGlobalFilters(new GlobalExceptionFilter());
  app.use((req: any, res: any, next: any) => {
    res.locals.nonce = nanoid();
    next();
  });

  ThrottlerModule.forRoot({
    throttlers: [
      {
        ttl: 60,
        limit: 100,
      },
    ],
  });

  app.use(cookieParser());

  app.use(morgan('dev'));
  app.enableCors({
    origin: (origin, callback) => {
      const allowedOrigins =
        process.env.NODE_ENV === 'production'
          ? [process.env.CLIENT_URL]
          : ['http://localhost:3000'];

      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  });

  await app.listen(3000);
}

bootstrap();
