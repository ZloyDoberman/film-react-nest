import { Body, Controller, Post } from '@nestjs/common';
import { OrderService } from './order.service';
import { PostOrderDto } from './dto/order.dto';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}
  @Post()
  async create(@Body() createOrderDto: PostOrderDto) {
    return this.orderService.createOrder(createOrderDto);
  }
}
