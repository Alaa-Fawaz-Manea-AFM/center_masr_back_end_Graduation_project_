import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  PORT: z.string().default('3000'),
  HOST: z.string().default('localhost'),

  DATABASE_URL: z.string(),
  DB_HOST: z.string(),
  DB_PORT: z.string().default('5432'),
  DB_NAME: z.string(),
  DB_USERNAME: z.string(),
  DB_PASSWORD: z.string(),
  DB_DIALECT: z.string().default('postgres'),
  DB_SSL: z.enum(['true', 'false']).default('true'),

  JWT_SECRET_KEY: z.string(),
  JWT_EXPIRES_IN: z.string().default('1d'),
  JWT_REFRESH_SECRET_KEY: z.string(),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),
  JWT_ISSUER: z.string().default('my-app'),

  REDIS_HOST: z.string(),
  REDIS_PORT: z.string().default('6379'),

  CLIENT_URL: z.string().default('http://localhost:3000'),

  COOKIE_DOMAIN: z.string().default('localhost'),
});

@Injectable()
export default class AppConfig {
  constructor(private configService: ConfigService) {}

  private get validatedEnv() {
    return envSchema.parse(process.env);
  }

  get nodeEnv(): 'development' | 'production' | 'test' {
    return this.validatedEnv.NODE_ENV;
  }

  get host(): string {
    return this.validatedEnv.HOST;
  }

  get port(): number {
    return Number(this.validatedEnv.PORT);
  }

  get clientUrl(): string {
    return this.validatedEnv.CLIENT_URL;
  }

  get DATABASE_URL(): string {
    return this.validatedEnv.DATABASE_URL;
  }

  get dbHost(): string {
    return this.validatedEnv.DB_HOST;
  }

  get dbPort(): number {
    return Number(this.validatedEnv.DB_PORT);
  }

  get dbName(): string {
    return this.validatedEnv.DB_NAME;
  }

  get dbUsername(): string {
    return this.validatedEnv.DB_USERNAME;
  }

  get dbPassword(): string {
    return this.validatedEnv.DB_PASSWORD;
  }

  get dbDialect(): string {
    return this.validatedEnv.DB_DIALECT;
  }

  get dbSsl(): boolean {
    return this.validatedEnv.DB_SSL === 'true';
  }

  get jwtSecret(): string {
    return this.validatedEnv.JWT_SECRET_KEY;
  }

  get jwtExpiresIn(): string {
    return this.validatedEnv.JWT_EXPIRES_IN;
  }

  get jwtRefreshSecret(): string {
    return this.validatedEnv.JWT_REFRESH_SECRET_KEY;
  }

  get jwtRefreshExpiresIn(): string {
    return this.validatedEnv.JWT_REFRESH_EXPIRES_IN;
  }

  get jwtIssuer(): string {
    return this.validatedEnv.JWT_ISSUER;
  }

  get redisHost(): string {
    return this.validatedEnv.REDIS_HOST;
  }

  get redisPort(): number {
    return Number(this.validatedEnv.REDIS_PORT);
  }

  get cookieDomain(): string {
    return this.validatedEnv.COOKIE_DOMAIN;
  }
}
