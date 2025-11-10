import { Test } from '@nestjs/testing';
import { FilmsController } from './films.controller';
import { FilmsService } from './films.service';

describe('FilmsController', () => {
  let filmsController: FilmsController;
  let filmService: FilmsService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [FilmsController],
      providers: [FilmsService],
    })
      .overrideProvider(FilmsService)
      .useValue({
        getAllFilms: jest.fn(),
        getSchedulesById: jest.fn(),
      })
      .compile();

    filmsController = moduleRef.get<FilmsController>(FilmsController);
    filmService = moduleRef.get<FilmsService>(FilmsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('вызов метода сервиса .getAllFilms()', async () => {
    await filmsController.findAll();
    expect(filmService.getAllFilms).toHaveBeenCalled();
  });

  it('вызов метода сервиса .getSchedulesById()', async () => {
    const filmId = '123';
    await filmsController.getSchedule(filmId);
    expect(filmService.getSchedulesById).toHaveBeenCalledWith(filmId);
  });
});
