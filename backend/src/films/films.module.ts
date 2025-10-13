import { Module } from '@nestjs/common';
import { FilmsController } from './films.controller';
import { FilmsService } from './films.service';
import { filmsProviders } from './films';
import { FilmsRepository } from '../repository/films.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Films } from './entities/film.entity';
import { Schedules } from './entities/schedule.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Films, Schedules])],
  controllers: [FilmsController],
  providers: [FilmsService],
})
export class FilmsModule {}
