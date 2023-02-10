import 'reflect-metadata';
import { PrimaryKey, Property, types } from '@mikro-orm/core';
import { v4 as uuidv4 } from 'uuid';

export abstract class BaseEntity {
  @PrimaryKey({ type: types.uuid })
  uuid = uuidv4();

  @Property({ type: types.datetime, onCreate: () => Date.now(), defaultRaw: 'current_timestamp' })
  createdAt = Date.now();

  @Property({ type: types.datetime, onUpdate: () => Date.now(), defaultRaw: 'current_timestamp' })
  updatedAt = Date.now();

  constructor(uuid: string = uuidv4()) {
    this.uuid = uuid;
  }
}
