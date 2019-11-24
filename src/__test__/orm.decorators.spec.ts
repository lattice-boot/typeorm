import * as utils from './../orm.utils';
import * as inversify from 'inversify';
import { InjectConnection, InjectManager, InjectRepository } from '../orm.decorators';

describe('Orm decorator test', () => {
  let tokenRecord: any;

  beforeAll(() => {
    jest.spyOn(utils, 'bindConnection').mockImplementation((token) => 'bindConnection');
    jest.spyOn(utils, 'bindManager').mockImplementation((token) => 'bindManager');
    jest.spyOn(utils, 'bindRepository').mockImplementation((token) => 'bindRepository');
    jest.spyOn(inversify, 'inject').mockImplementation((token: any) => {
      tokenRecord = token;
      return () => { };
    });
  });

  afterAll(() => {
    jest.spyOn(utils, 'bindConnection').mockClear();
    jest.spyOn(utils, 'bindManager').mockClear();
    jest.spyOn(utils, 'bindRepository').mockClear();
    jest.spyOn(inversify, 'inject').mockClear();
  });

  it('should inject with InjectConnection', () => {
    InjectConnection('test');
    expect(tokenRecord).toBe('bindConnection');
  });

  it('should inject with InjectManager', () => {
    InjectManager('test');
    expect(tokenRecord).toBe('bindManager');
  });

  it('should inject with InjectRepository', () => {
    InjectRepository('test');
    expect(tokenRecord).toBe('bindRepository');
  });
});
