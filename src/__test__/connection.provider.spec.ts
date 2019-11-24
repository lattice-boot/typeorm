import * as typeorm from 'typeorm';
import { rootContainer } from '@lattice/core';
import { ConnectionCreator, ORM_OPTION_TOKEN } from '../connection.provider';

describe('ConnectionCreator test', () => {
  let optionRecord: typeorm.ConnectionOptions;

  beforeAll(() => {
    jest.spyOn(typeorm, 'createConnections').mockImplementation((option) => {
      optionRecord = option as any;
      return null as any;
    });
  });

  afterAll(() => {
    jest.spyOn(typeorm, 'createConnections').mockClear();
  });

  it('should created connection with out orm options', async () => {
    const instance = rootContainer.get(ConnectionCreator);
    await instance.create();
    expect(optionRecord).toBeUndefined();
  });

  it('should created connection with connectionOptions', async () => {
    rootContainer.unbind(ConnectionCreator);
    rootContainer.bind(ConnectionCreator).toSelf();
    rootContainer.bind(ORM_OPTION_TOKEN).toConstantValue({
      testOption: 'test',
    });
    const instance = rootContainer.get(ConnectionCreator);
    await instance.create();
    expect(optionRecord).toEqual([{
      testOption: 'test',
    }]);
  });

  it('should created connection with connectionOptions array', async () => {
    rootContainer.unbind(ConnectionCreator);
    rootContainer.bind(ConnectionCreator).toSelf();
    rootContainer.unbind(ORM_OPTION_TOKEN);
    rootContainer.bind(ORM_OPTION_TOKEN).toConstantValue([{
      testOption: 'test',
    }, {
      testOption: 'test1',
    }]);
    const instance = rootContainer.get(ConnectionCreator);
    await instance.create();
    expect(optionRecord).toEqual([{
      testOption: 'test',
    }, {
      testOption: 'test1',
    }]);
  });
});
