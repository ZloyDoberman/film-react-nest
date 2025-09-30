import { Schema } from 'mongoose';
import { FilmDocument } from '../films/films.interface';

export const FilmSchema = new Schema<FilmDocument>(
  {
    id: String,
    rating: Number,
    director: String,
    tags: [String],
    image: String,
    cover: String,
    title: String,
    about: String,
    description: String,
    schedule: [
      {
        id: String,
        daytime: Date,
        hall: Number,
        rows: {
          type: Number,
          min: 1,
          max: 5,
          default: 1,
        },
        seats: {
          type: Number,
          min: 1,
          max: 10,
          default: 1,
        },
        price: {
          type: Number,
          min: 0,
          default: 0,
        },
        taken: [String],
      },
    ],
  },
  {
    _id: false,
  },
);
