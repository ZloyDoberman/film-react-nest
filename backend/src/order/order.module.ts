import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { OrderRepository } from '../repository/order.repository';
import { filmsProviders } from '../films/films';

@Module({
  controllers: [OrderController],
  providers: [...filmsProviders, OrderService, OrderRepository],
})
export class OrderModule {}
