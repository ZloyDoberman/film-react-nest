import { Test, TestingModule } from '@nestjs/testing';
import { Films } from './films';

describe('Films', () => {
  let provider: Films;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [Films],
    }).compile();

    provider = module.get<Films>(Films);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
