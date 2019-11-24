import { registFactory } from '@lattice/core';
import { ConnectionCreator } from './connection.provider';
import { getConnection, getManager, getRepository } from 'typeorm';

const boundToken: Set<string> = new Set();

async function checkRegistFactory(token: string, factory: () => any) {
  if (boundToken.has(token)) return;
  registFactory({
    provide: token,
    useFactory: async (creator: ConnectionCreator) => {
      !creator.connected && await creator.create();
      return factory();
    },
    inject: [ConnectionCreator],
  });
  boundToken.add(token);
}

export function bindConnection(name?: string) {
  const token = getConnectionToken(name);
  checkRegistFactory(token, () => name ? getConnection(name) : getConnection());
  return token;
}

export function bindManager(name?: string) {
  const token = getManagerToken(name);
  checkRegistFactory(token, () => name ? getManager(name) : getManager());
  return token;
}

export function bindRepository(entity: { new(...arg: any[]): any }, name?: string) {
  const token = getRepositoryToken(entity.name, name);
  checkRegistFactory(token, () => name ? getRepository(entity, name) : getRepository(entity));
  return token;
}

export function getConnectionToken(name?: string) {
  return `__connect_${name || 'default'}__`;
}

export function getManagerToken(name?: string) {
  return `__manager_${name || 'default'}__`;
}

export function getRepositoryToken(repoName: string, name?: string) {
  return `__repo_${name || 'default'}_${repoName}__`;
}
