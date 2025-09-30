import { Module } from '@nestjs/common';
import { FilmsController } from './films.controller';
import { FilmsService } from './films.service';
import { filmsProviders } from './films';
import { FilmsRepository } from '../repository/films.repository';

@Module({
  controllers: [FilmsController],
  providers: [...filmsProviders, FilmsService, FilmsRepository],
})
export class FilmsModule {}
