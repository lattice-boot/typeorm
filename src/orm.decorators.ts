import { bindConnection, bindManager, bindRepository } from './orm.utils';
import { inject } from 'inversify';

export function InjectConnection(connectionName?: string) {
  const token = bindConnection(connectionName);
  return inject(token);
}

export function InjectManager(connectionName?: string) {
  const token = bindManager(connectionName);
  return inject(token);
}

export function InjectRepository(entityClass: any, connectionName?: string) {
  const token = bindRepository(entityClass, connectionName);
  return inject(token);
}
