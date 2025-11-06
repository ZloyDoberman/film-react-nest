import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import 'dotenv/config';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './exceptions/exists.filter';
import { DevLogger } from './logger/dev.logger';
import { JsonLogger } from './logger/json.logger';
import { TskvLogger } from './logger/tskv.logger';

export type LoggerType = 'DevLogger' | 'JsonLogger' | 'TskvLogger';

const LoggerFactory = (type: LoggerType) => {
  switch (type) {
    case 'DevLogger':
      return new DevLogger();
    case 'JsonLogger':
      return new JsonLogger();
    case 'TskvLogger':
      return new TskvLogger();
    default:
      return new DevLogger();
  }
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });
  app.setGlobalPrefix('api/afisha');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.useGlobalFilters(new HttpExceptionFilter());
  app.enableCors();
  app.useLogger(
    LoggerFactory((process.env.LOG_FORMAT as LoggerType) || 'DevLogger'),
  );
  await app.listen(3000);
}
bootstrap();
