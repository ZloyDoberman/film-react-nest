import { Connection } from 'mongoose';
import { FilmSchema } from '../schemas/films.schema';

export const filmsProviders = [
  {
    provide: 'FILM',
    useFactory: (connection: Connection) =>
      connection.model('Film', FilmSchema),
    inject: ['DATABASE'],
  },
];
