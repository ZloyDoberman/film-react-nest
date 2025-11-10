import { Test } from '@nestjs/testing';
import { FilmsService } from './films.service';
import { FilmsRepository } from '../repository/films.repository';

describe('FilmsService', () => {
  let filmService: FilmsService;
  let filmsRepository: jest.Mocked<FilmsRepository>;

  const mockFilms = [
    {
      id: '92b8a2a7-ab6b-4fa9-915b-d27945865e39',
      rating: 8.1,
      director: 'Амелия Хьюз',
      tags: 'Рекомендуемые',
      image: '/bg6s.jpg',
      cover: '/bg6c.jpg',
      title: 'Сон в летний день',
      about:
        'Фэнтези-фильм о группе друзей попавших в волшебный лес, где время остановилось.',
      description:
        'Причудливый фэнтези-фильм, действие которого происходит в волшебном лесу, где время остановилось. Группа друзей натыкается на это заколдованное царство и поначалу проникается беззаботным духом обитателей, но потом друзьям приходится разойтись. А как встретиться снова, если нет ни времени, ни места встречи?',
      schedules: [
        {
          id: '5274c89d-f39c-40f9-bea8-f22a22a50c8a',
          daytime: '2024-06-28T10:00:53+03:00',
          hall: 0,
          rows: 5,
          seats: 10,
          price: 350,
          taken: '1:1',
          filmId: '92b8a2a7-ab6b-4fa9-915b-d27945865e39',
          film: null,
        },
      ],
    },
  ];

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        FilmsService,
        {
          provide: FilmsRepository,
          useValue: {
            findAll: jest.fn(),
            findById: jest.fn(),
            findSchedules: jest.fn(),
          },
        },
      ],
    }).compile();

    filmService = moduleRef.get<FilmsService>(FilmsService);
    filmsRepository = moduleRef.get(
      FilmsRepository,
    ) as jest.Mocked<FilmsRepository>;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('проверка работы метода .findAll(), должен возвращать список всех фильмов', async () => {
    filmsRepository.findAll.mockResolvedValue(mockFilms);
    const result = await filmService.getAllFilms();
    expect(filmsRepository.findAll).toHaveBeenCalled();
    expect(result).toEqual({ total: mockFilms.length, items: mockFilms });
  });

  it('проверка работы метода .findById() и .findSchedules(), должен возвращать расписания для фильма по id', async () => {
    filmsRepository.findById.mockResolvedValue(mockFilms[0]);
    filmsRepository.findSchedules.mockResolvedValue(mockFilms[0].schedules);
    const result = await filmService.getSchedulesById(mockFilms[0].id);
    expect(filmsRepository.findById).toHaveBeenCalled();
    expect(filmsRepository.findSchedules).toHaveBeenCalled();

    const schedules = mockFilms[0].schedules.map((item) => ({
      id: item.id,
      daytime: item.daytime,
      hall: item.hall,
      rows: item.rows,
      seats: item.seats,
      price: item.price,
      taken: item.taken.split(','),
    }));
    expect(result).toEqual({
      total: mockFilms[0].schedules.length,
      items: schedules,
    });
  });
});
