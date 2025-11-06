import { DevLogger } from './dev.logger';

describe('DevLogger', () => {
  let logger: DevLogger;
  let outSpy: jest.SpyInstance;

  beforeEach(() => {
    logger = new DevLogger();
    outSpy = jest.spyOn(process.stdout, 'write').mockImplementation();
  });

  afterEach(() => {
    outSpy.mockRestore();
  });

  it('Тест на форматирование текста', () => {
    const message = 'Тестовое сообщение';
    const context = 'Тестовый контекст';

    logger.log(message, context);

    expect(outSpy).toHaveBeenCalled();
    const output = outSpy.mock.calls[0][0];
    expect(output).toContain(message);
    expect(output).toContain(context);
  });
});
