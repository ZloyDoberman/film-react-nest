import { Injectable, NotFoundException } from '@nestjs/common';
import {
  FilmsResponseDto,
  GetScheduleDTO,
  ScheduleResponseDto,
} from './dto/films.dto';
import { FilmsRepository } from '../repository/films.repository';

@Injectable()
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

    const schedules = await this.filmsRepository.findSchedules(id);

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
