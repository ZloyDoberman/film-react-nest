import { InjectRepository } from '@nestjs/typeorm';
import { Schedules } from '../entities/postgres/schedule.entity';
import { EntityManager, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
@Injectable()
export class OrderRepository {
  constructor(
    @InjectRepository(Schedules)
    private schedulesRepository: Repository<Schedules>,
  ) {}

  async findFilmAndSession(
    filmId: string,
    sessionId: string,
    transactionalManager?: EntityManager,
  ) {
    const repository = transactionalManager
      ? transactionalManager.getRepository(Schedules)
      : this.schedulesRepository;

    const schedule = await repository
      .createQueryBuilder('schedule')
      .setLock('pessimistic_write')
      .where('schedule.id = :sessionId AND schedule.filmId = :filmId', {
        sessionId,
        filmId,
      })
      .getOne();
    return schedule;
  }

  async updTaken(
    filmId: string,
    sessionId: string,
    taken: string,
    transactionalManager?: EntityManager,
  ) {
    const repository = transactionalManager
      ? transactionalManager.getRepository(Schedules)
      : this.schedulesRepository;

    await repository.update(
      { id: sessionId, filmId: filmId },
      { taken: taken },
    );
  }
}
