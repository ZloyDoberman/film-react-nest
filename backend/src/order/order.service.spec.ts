import { Test, TestingModule } from '@nestjs/testing';
import { DataSource } from 'typeorm';
import { OrderService } from './order.service';
import { OrderRepository } from '../repository/order.repository';
import { PostOrderDto, TicketsResponseDto } from './dto/order.dto';
import { PlaceException } from '../exceptions/places.exception';

describe('OrderService', () => {
  let orderService: OrderService;
  let orderRepository: jest.Mocked<OrderRepository>;

  const mockQueryRunner = {
    connect: jest.fn(),
    startTransaction: jest.fn(),
    commitTransaction: jest.fn(),
    rollbackTransaction: jest.fn(),
    release: jest.fn(),
    manager: {},
  };

  const mockDataSource = {
    createQueryRunner: jest.fn().mockReturnValue(mockQueryRunner),
  };

  const mockFilms = [
    {
      id: '92b8a2a7-ab6b-4fa9-915b-d27945865e39',
      rating: 8.1,
      director: 'Амелия Хьюз',
      tags: 'Рекомендуемые',
      image: '/bg6s.jpg',
      cover: '/bg6c.jpg',
      title: 'Сон в летний день',
      about:
        'Фэнтези-фильм о группе друзей попавших в волшебный лес, где время остановилось.',
      description:
        'Причудливый фэнтези-фильм, действие которого происходит в волшебном лесу, где время остановилось. Группа друзей натыкается на это заколдованное царство и поначалу проникается беззаботным духом обитателей, но потом друзьям приходится разойтись. А как встретиться снова, если нет ни времени, ни места встречи?',
      schedules: [
        {
          id: '5274c89d-f39c-40f9-bea8-f22a22a50c8a',
          daytime: '2024-06-28T10:00:53+03:00',
          hall: 0,
          rows: 5,
          seats: 10,
          price: 350,
          taken: '1:10',
          filmId: '92b8a2a7-ab6b-4fa9-915b-d27945865e39',
          film: null,
        },
      ],
    },
  ];

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService,
        {
          provide: DataSource,
          useValue: mockDataSource,
        },
        {
          provide: OrderRepository,
          useValue: {
            findFilmAndSession: jest.fn(),
            updTaken: jest.fn(),
          },
        },
      ],
    }).compile();

    orderService = moduleRef.get<OrderService>(OrderService);
    orderRepository = moduleRef.get(
      OrderRepository,
    ) as jest.Mocked<OrderRepository>;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createOrder', () => {
    const validOrder: PostOrderDto = {
      email: 'test@gmail.ru',
      phone: '+79999999999',
      tickets: [
        {
          film: '92b8a2a7-ab6b-4fa9-915b-d27945865e39',
          session: '5274c89d-f39c-40f9-bea8-f22a22a50c8a',
          daytime: '2024-06-28T10:00:00+03:00',
          row: 1,
          seat: 1,
          price: 350,
          day: '2024-06-28T10:00:53+03:00',
          time: '12:00',
        },
        {
          film: '92b8a2a7-ab6b-4fa9-915b-d27945865e39',
          session: '5274c89d-f39c-40f9-bea8-f22a22a50c8a',
          daytime: '2024-06-28T10:00:00+03:00',
          row: 1,
          seat: 2,
          price: 350,
          day: '2024-06-28T10:00:53+03:00',
          time: '12:00',
        },
      ],
    };

    it('успешно создает заказ', async () => {
      orderRepository.findFilmAndSession.mockResolvedValue(
        mockFilms[0].schedules[0],
      );
      orderRepository.updTaken.mockResolvedValue(undefined);

      const result = await orderService.createOrder(validOrder);

      expect(orderRepository.findFilmAndSession).toHaveBeenCalled();
      expect(orderRepository.updTaken).toHaveBeenCalled();
      expect(mockQueryRunner.commitTransaction).toHaveBeenCalled();
      expect(mockQueryRunner.rollbackTransaction).not.toHaveBeenCalled();

      const ticketsResult: TicketsResponseDto[] = validOrder.tickets.map(
        (item) => ({
          film: item.film,
          session: item.session,
          daytime: item.daytime,
          row: item.row,
          seat: item.seat,
          price: item.price,
        }),
      );

      expect(result).toEqual({
        total: validOrder.tickets.length,
        items: ticketsResult,
      });
    });

    it('ошибка если заказанные места уже заняты', async () => {
      orderRepository.findFilmAndSession.mockResolvedValue({
        ...mockFilms[0].schedules[0],
        taken: '1:1',
      });

      await expect(orderService.createOrder(validOrder)).rejects.toThrow(
        PlaceException,
      );
      expect(mockQueryRunner.rollbackTransaction).toHaveBeenCalled();
    });
  });
});
