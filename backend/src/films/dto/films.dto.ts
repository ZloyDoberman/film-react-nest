export class GetScheduleDTO {
  id: string;
  daytime: string;
  hall: number;
  rows: number;
  seats: number;
  price: number;
  taken?: string[];
}

export class GetFilmDto {
  id: string;
  rating: number;
  director: string;
  tags: string;
  image: string;
  cover: string;
  title: string;
  about: string;
  description: string;
}

export class FilmsResponseDto {
  total: number;
  items: GetFilmDto[];
}

export class ScheduleResponseDto {
  total: number;
  items: GetScheduleDTO[];
}
