import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderRepository } from '../repository/order.repository';
import { Schedules } from '../entities/postgres/schedule.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Schedules])],
  controllers: [OrderController],
  providers: [OrderService, OrderRepository],
})
export class OrderModule {}
