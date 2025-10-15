import { InjectRepository } from '@nestjs/typeorm';
import { Films } from '../entities/postgres/film.entity';
import { Schedules } from '../entities/postgres/schedule.entity';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class FilmsRepository {
  constructor(
    @InjectRepository(Films)
    private filmsRepository: Repository<Films>,

    @InjectRepository(Schedules)
    private schedulesRepository: Repository<Schedules>,
  ) {}

  async findAll() {
    return this.filmsRepository.find();
  }

  async findById(id: string) {
    return this.filmsRepository.findOneBy({ id });
  }

  async findSchedules(id: string, sort: 'ASC' | 'DESC' = 'ASC') {
    return this.schedulesRepository.find({
      where: { filmId: id },
      order: {
        daytime: sort,
      },
    });
  }
}
