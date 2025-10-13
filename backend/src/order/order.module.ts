import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { OrderRepository } from '../repository/order.repository';
import { filmsProviders } from '../films/films';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Films } from '../films/entities/film.entity';
import { Schedules } from '../films/entities/schedule.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Schedules])],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
