import { Inject } from '@nestjs/common';
import { Model } from 'mongoose';
import { FilmDocument } from 'src/films/films.interface';

export class OrderRepository {
  constructor(
    @Inject('FILM')
    private filmModel: Model<FilmDocument>,
  ) {}

  async create(places: string[], filmId: string, sessionId: string) {
    return this.filmModel.findOneAndUpdate(
      {
        id: filmId,
        'schedule.id': sessionId,
      },
      {
        $push: {
          'schedule.$.taken': {
            $each: places,
          },
        },
      },
      { new: true },
    );
  }

  async findPlaces(places: string[], filmId: string, sessionId: string) {
    const film = await this.filmModel.findOne({
      id: filmId,
      'schedule.id': sessionId,
      'schedule.taken': { $in: places },
    });
    return film ? true : false;
  }
}
