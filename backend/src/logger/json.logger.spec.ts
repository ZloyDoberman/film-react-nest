import { JsonLogger } from './json.logger';

describe('JSONLogger', () => {
  let logger: JsonLogger;
  let consoleSpy: jest.SpyInstance;

  beforeEach(() => {
    logger = new JsonLogger();
    consoleSpy = jest.spyOn(console, 'log').mockImplementation();
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  it('Тест на форматирования текста в JSON', () => {
    const result = logger.formatMessage(
      'log',
      'FilmsModule dependencies initialized',
      ['InstanceLoader'],
    );
    expect(result).toEqual(
      '{"level":"log","message":"FilmsModule dependencies initialized","optionalParams":[["InstanceLoader"]]}',
    );
  });
});
