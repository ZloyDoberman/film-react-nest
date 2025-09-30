import { Injectable, NotFoundException } from '@nestjs/common';
import { FilmsRepository } from '../repository/films.repository';
import { FilmsResponseDto, ScheduleResponseDto } from './dto/films.dto';

@Injectable()
export class FilmsService {
  constructor(private readonly filmsRepository: FilmsRepository) {}
  async getAllFilms(): Promise<FilmsResponseDto> {
    const films = await this.filmsRepository.findAll();

    if (!films) {
      throw new NotFoundException(`Films not found!`);
    }

    return {
      total: films.length,
      items: films,
    };
  }
  async getSchedulesById(id: string): Promise<ScheduleResponseDto> {
    const film = await this.filmsRepository.findById(id);

    if (!film) {
      throw new NotFoundException(`Film with ID ${id} not found!`);
    }

    return {
      total: film.schedule.length,
      items: film.schedule,
    };
  }
}
