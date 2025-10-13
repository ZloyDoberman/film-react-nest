import {
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import {
  OrderResponseDto,
  PostOrderDto,
  TicketsResponseDto,
} from './dto/order.dto';
import { PlaceException } from '../exceptions/places.exception';
import { Schedules } from '../films/entities/schedule.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

/*@Injectable()
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
}*/

@Injectable()
export class OrderService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(Schedules)
    private schedulesRepository: Repository<Schedules>,
  ) {}
  async createOrder(order: PostOrderDto): Promise<OrderResponseDto> {
    const places = order.tickets.map(
      (ticket) => `${ticket.row}:${ticket.seat}`,
    );
    const filmId = order.tickets[0].film;
    const sessionId = order.tickets[0].session;

    if (!filmId || !sessionId) {
      throw new NotFoundException('Не указаны фильм или сеанс');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const findFilmAndSession = await queryRunner.manager
        .createQueryBuilder(Schedules, 'schedule')
        .setLock('pessimistic_write')
        .where('schedule.id = :sessionId AND schedule.filmId = :filmId', {
          sessionId,
          filmId,
        })
        .getOne();

      if (!findFilmAndSession) {
        throw new NotFoundException('Указанный фильм и(или) сеанс не найдены');
      }

      const conflict = places.filter((item) =>
        findFilmAndSession.taken.split(',').includes(item),
      );

      if (conflict.length > 0) {
        throw new PlaceException('Выбранные места уже заняты');
      }

      const updTaken = [...findFilmAndSession.taken.split(','), ...places].join(
        ',',
      );

      await queryRunner.manager.update(
        Schedules,
        { id: sessionId, filmId: filmId },
        { taken: updTaken },
      );

      const items: TicketsResponseDto[] = order.tickets.map((ticket) => ({
        film: ticket.film,
        session: ticket.session,
        daytime: ticket.daytime,
        row: ticket.row,
        seat: ticket.seat,
        price: ticket.price,
      }));

      const total = items.length;

      await queryRunner.commitTransaction();

      return {
        total,
        items,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException(
        `Произошла ошибка при создании заказа: ${error.message}`,
      );
    } finally {
      await queryRunner.release();
    }
  }
}
