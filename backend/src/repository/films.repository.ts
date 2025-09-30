import { Inject } from '@nestjs/common';
import { Model } from 'mongoose';
import { FilmDocument } from '../films/films.interface';

export class FilmsRepository {
  constructor(
    @Inject('FILM')
    private filmModel: Model<FilmDocument>,
  ) {}

  async findAll() {
    return this.filmModel.find({}).select('-schedule -_id');
  }

  async findById(id: string) {
    return this.filmModel.findOne({ id }).select('schedule -_id');
  }
}
