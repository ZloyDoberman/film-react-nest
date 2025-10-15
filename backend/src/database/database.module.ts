import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
dotenv.config();

@Module({
  imports: [
    ...(process.env.DATABASE_DRIVER === 'mongodb'
      ? [
          MongooseModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
              uri: configService.get<string>('DATABASE_URL'),
            }),
          }),
        ]
      : [
          TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
              type: 'postgres',
              host: configService.get<string>('POSTGRES_HOST'),
              port: configService.get<number>('POSTGRES_PORT'),
              username: configService.get<string>('DATABASE_USERNAME'),
              password: configService.get<string>('DATABASE_PASSWORD'),
              database: configService.get<string>('POSTGRES_DATABASE'),
              entities: [
                __dirname + '/../entities/postgres/**/*.entity{.ts,.js}',
              ],
              migrations: [__dirname + '/../database/migrations/**/*{.ts,.js}'],
              synchronize:
                configService.get<string>('NODE_ENV') === 'development',
            }),
          }),
        ]),
  ],
})
export class DatabaseModule {}
