import { TskvLogger } from './tskv.logger';

describe('TSKVLogger', () => {
  let logger: TskvLogger;
  let consoleSpy: jest.SpyInstance;

  beforeEach(() => {
    logger = new TskvLogger();
    consoleSpy = jest.spyOn(console, 'log').mockImplementation();
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  it('Тест на форматирования текста в TSKV', () => {
    const result = logger.formatMessage(
      'log',
      'Nest application successfully started',
      ['InstanceLoader'],
    );
    expect(result).toEqual(
      'level=log\\tmessage=Nest application successfully started\\tInstanceLoader\\n',
    );
  });
});
