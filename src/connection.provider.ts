import { Injectable, Inject, Optional } from '@lattice/core';
import { createConnections, ConnectionOptions } from 'typeorm';
import { initializeTransactionalContext, patchTypeORMRepositoryWithBaseRepository } from 'typeorm-transactional-cls-hooked';

export const ORM_OPTION_TOKEN = '__orm_option__';

@Injectable(ConnectionCreator, 'root')
export class ConnectionCreator {
  connected = false;

  @Inject(ORM_OPTION_TOKEN)
  @Optional()
  private connectionOptions!: ConnectionOptions | ConnectionOptions[];

  async create(): Promise<void> {
    initializeTransactionalContext();
    patchTypeORMRepositoryWithBaseRepository();
    if (this.connectionOptions) {
      this.connectionOptions = this.connectionOptions instanceof Array ? this.connectionOptions : [this.connectionOptions];
      await createConnections(this.connectionOptions);
    } else {
      await createConnections();
    }
    this.connected = true;
  }

}
