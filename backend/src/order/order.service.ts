import { Injectable, NotFoundException } from '@nestjs/common';
import {
  OrderResponseDto,
  PostOrderDto,
  TicketsResponseDto,
} from './dto/order.dto';
import { OrderRepository } from '../repository/order.repository';
import { PlaceException } from '../exceptions/places.exception';

@Injectable()
export class OrderService {
  constructor(private readonly orderRepository: OrderRepository) {}
  async createOrder(order: PostOrderDto): Promise<OrderResponseDto> {
    const places = order.tickets.map(
      (ticket) => `${ticket.row}:${ticket.seat}`,
    );
    const filmId = order.tickets[0].film;
    const sessionId = order.tickets[0].session;

    if (!filmId || !sessionId) {
      throw new NotFoundException('Не указаны фильм или сеанс');
    }

    const findFilmAndSession = await this.orderRepository.findFilmAndSession(
      filmId,
      sessionId,
    );

    if (!findFilmAndSession) {
      throw new NotFoundException('Указанный фильм и(или) сеанс не найдены');
    }

    const findPlaces = await this.orderRepository.findPlaces(
      places,
      filmId,
      sessionId,
    );

    if (findPlaces) {
      throw new PlaceException('Выбранные места уже заняты');
    }

    await this.orderRepository.create(places, filmId, sessionId);

    try {
      const items: TicketsResponseDto[] = order.tickets.map((ticket) => ({
        film: ticket.film,
        session: ticket.session,
        daytime: ticket.daytime,
        row: ticket.row,
        seat: ticket.seat,
        price: ticket.price,
      }));

      const total = items.length;
      return {
        total,
        items,
      };
    } catch (error) {
      throw new Error(`Ошибка при создании заказа: ${error.message}`);
    }
  }
}
