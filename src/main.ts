import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { NestFactory } from '@nestjs/core';
import { AppModule, ObserveInstrument } from './app.module.js';
import { setupSwagger } from './swagger.js';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    instrument: ObserveInstrument,
  });
  const allowedOrigins = (process.env.CORS_ORIGINS ?? '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
  app.enableCors({
    origin: (origin, callback) => {
      const localOrigin =
        origin !== undefined &&
        /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);
      const isProduction = process.env.NODE_ENV === 'production';
      callback(
        null,
        origin === undefined ||
          (!isProduction && localOrigin) ||
          allowedOrigins.includes(origin ?? ''),
      );
    },
    credentials: true,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  setupSwagger(app);

  const port = Number(process.env.PORT ?? 3000);
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error('PORT doit être un entier compris entre 1 et 65535.');
  }
  await app.listen(port, process.env.HOST ?? '127.0.0.1');
}
await bootstrap();
