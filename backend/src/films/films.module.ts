import { Module } from '@nestjs/common';
import { FilmsController } from './films.controller';
import { FilmsService } from './films.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FilmsRepository } from '../repository/films.repository';
import { Films } from '../entities/postgres/film.entity';
import { Schedules } from '../entities/postgres/schedule.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Films, Schedules])],
  controllers: [FilmsController],
  providers: [FilmsService, FilmsRepository],
})
export class FilmsModule {}
