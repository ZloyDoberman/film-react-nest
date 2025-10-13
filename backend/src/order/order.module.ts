import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Schedules } from '../films/entities/schedule.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Schedules])],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
