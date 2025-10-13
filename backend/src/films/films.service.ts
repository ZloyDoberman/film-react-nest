import { Injectable, NotFoundException } from '@nestjs/common';
import {
  FilmsResponseDto,
  GetScheduleDTO,
  ScheduleResponseDto,
} from './dto/films.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Films } from './entities/film.entity';
import { Repository } from 'typeorm';
import { Schedules } from './entities/schedule.entity';

/*@Injectable()
export class FilmsService {
  constructor(private readonly filmsRepository: FilmsRepository) {}
  async getAllFilms(): Promise<FilmsResponseDto> {
    const films = await this.filmsRepository.findAll();

    if (!films) {
      throw new NotFoundException(`Фильмы не найдены`);
    }

    return {
      total: films.length,
      items: films,
    };
  }
  async getSchedulesById(id: string): Promise<ScheduleResponseDto> {
    const film = await this.filmsRepository.findById(id);

    if (!film) {
      throw new NotFoundException(`Фильм с указанным id не найден`);
    }

    return {
      total: film.schedule.length,
      items: film.schedule,
    };
  }
}*/

@Injectable()
export class FilmsService {
  constructor(
    @InjectRepository(Films)
    private filmsRepository: Repository<Films>,

    @InjectRepository(Schedules)
    private schedulesRepository: Repository<Schedules>,
  ) {}
  async getAllFilms(): Promise<FilmsResponseDto> {
    const films = await this.filmsRepository.find();

    if (!films) {
      throw new NotFoundException(`Фильмы не найдены`);
    }

    return {
      total: films.length,
      items: films,
    };
  }

  async getSchedulesById(id: string): Promise<ScheduleResponseDto> {
    const film = await this.filmsRepository.findOneBy({ id });

    if (!film) {
      throw new NotFoundException(`Фильм с указанным id не найден`);
    }

    const schedules = await this.schedulesRepository.find({
      where: { filmId: id },
      order: {
        daytime: 'ASC',
      },
    });

    const schedulesDTO: GetScheduleDTO[] = schedules.map((item) => ({
      id: item.id,
      daytime: item.daytime,
      hall: item.hall,
      rows: item.rows,
      seats: item.seats,
      price: item.price,
      taken: item.taken.split(','),
    }));

    return {
      total: schedulesDTO.length,
      items: schedulesDTO,
    };
  }
}
