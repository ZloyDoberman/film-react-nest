import { Test } from '@nestjs/testing';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';

describe('OrderController', () => {
  let orderController: OrderController;
  let orderService: OrderService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [OrderController],
      providers: [OrderService],
    })
      .overrideProvider(OrderService)
      .useValue({
        createOrder: jest.fn(),
      })
      .compile();

    orderController = moduleRef.get<OrderController>(OrderController);
    orderService = moduleRef.get<OrderService>(OrderService);
  });

  it('вызов метода сервиса .createOrder(order)', async () => {
    const order = {
      email: 'test@test.ru',
      phone: '+7 (000) 000-00-00',
      tickets: [
        {
          film: '0e33c7f6-27a7-4aa0-8e61-65d7e6effecf',
          session: 'f2e429b0-685d-41f8-a8cd-1d8cb63b99ce',
          daytime: '2024-06-28T07:00:53.000Z',
          row: 3,
          seat: 5,
          price: 350,
          day: '24-04-1994',
          time: '00:00',
        },
      ],
    };
    await orderController.create(order);
    expect(orderService.createOrder).toHaveBeenCalledWith(order);
  });
});
