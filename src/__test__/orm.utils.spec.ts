import * as core from '@lattice/core';
import * as typeorm from 'typeorm';

import { getConnectionToken, getManagerToken, getRepositoryToken, bindConnection, bindManager, bindRepository } from '../orm.utils';
import { FactoryProvider } from '@lattice/core/dist/src/inject/interface';
import { ConnectionCreator } from '../connection.provider';

describe('Orm token utils test', () => {
  it('should return correct token by getConnectionToken', () => {
    const token = getConnectionToken('test');
    expect(token).toBe('__connect_test__');
  });

  it('should return correct token by getConnectionToken with out connection name', () => {
    const token = getConnectionToken();
    expect(token).toBe('__connect_default__');
  });

  it('should return correct token by getManagerToken', () => {
    const token = getManagerToken('test');
    expect(token).toBe('__manager_test__');
  });

  it('should return correct token by getManagerToken with out connection name', () => {
    const token = getManagerToken();
    expect(token).toBe('__manager_default__');
  });

  it('should return correct token by getRepositoryToken', () => {
    const token = getRepositoryToken('user', 'test');
    expect(token).toBe('__repo_test_user__');
  });

  it('should return correct token by getRepositoryToken with out connection name', () => {
    const token = getRepositoryToken('user');
    expect(token).toBe('__repo_default_user__');
  });
});

describe('Bind to container test', () => {
  let registRecore: FactoryProvider;

  beforeAll(() => {
    jest.spyOn(core, 'registFactory').mockImplementation(provider => registRecore = provider);
    jest.spyOn(typeorm, 'getRepository').mockImplementation((repo, name?: string) => `repo ${name} ${(repo as any).name}` as any);
  });

  afterAll(() => {
    jest.spyOn(core, 'registFactory').mockClear();
    jest.spyOn(typeorm, 'getRepository').mockClear();
  });

  it('should be bind connection by bindConnection', () => {
    const token = bindConnection('test');
    expect(registRecore.provide).toBe(token);
  });

  it('should be bind connection by bindConnection with out connection name', () => {
    registRecore = null as any;
    const token = bindConnection();
    expect(registRecore.provide).toBe(token);
  });

  it('should be bind manager by bindManager', () => {
    registRecore = null as any;
    const token = bindManager('test');
    expect(registRecore.provide).toBe(token);
  });

  it('should be bind manager by bindManager with out connection name', () => {
    registRecore = null as any;
    const token = bindManager();
    expect(registRecore.provide).toBe(token);
  });

  it('should be bind repository by bindRepository', () => {
    class TestEntity { }
    registRecore = null as any;
    const token = bindRepository(TestEntity, 'test');
    expect(registRecore.provide).toBe(token);
  });

  it('should be bind repository by bindRepository with out connection name', () => {
    class TestEntity { }
    registRecore = null as any;
    const token = bindRepository(TestEntity);
    expect(registRecore.provide).toBe(token);
  });

  it('should generate factory and create connection when not connected', async () => {
    let created = false;
    const mockCreator = { connected: false, create: async () => { created = true } } as ConnectionCreator;
    const res = await registRecore.useFactory(mockCreator);
    expect(res).toBe(`repo undefined TestEntity`)
    expect(created).toBe(true);
  });

  it('should generate factory and chouldm\'t connection when connected', async () => {
    let created = false;
    const mockCreator = { connected: true, create: async () => { created = true } } as ConnectionCreator;
    const res = await registRecore.useFactory(mockCreator);
    expect(created).toBe(false);
  });

  it('should skip bind when token bound', async () => {
    class TestEntity { }
    registRecore = null as any;
    const token = bindRepository(TestEntity);
    expect(registRecore).toBeNull();
  });
});
