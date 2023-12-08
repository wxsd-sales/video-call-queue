import type { RequestEvent, RequestHandler } from '@sveltejs/kit';
import * as entity from '../../../../../database/entities';
import config from '../../../../../../mikro-orm.config';
import { LoadStrategy, MikroORM } from '@mikro-orm/core';
import { Expose, plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { classTransformOptions, classValidationOptions } from '../../../../.utils';

export const GET: RequestHandler = async (requestEvent: RequestEvent) => {
  class RequestQueryDTO {
    @Expose()
    public readonly userId!: string;
  }

  const query = plainToInstance(RequestQueryDTO, requestEvent.params, classTransformOptions);
  const queryValidationErrors = validateSync(query, classValidationOptions);
  if (queryValidationErrors.length > 0) {
    return { status: 400, body: { query: queryValidationErrors } };
  }
  const db = await MikroORM.init({
    ...config,
    ...{ entities: [entity.Session, entity.User, entity.Data, entity.Demo] }
  }).then((r) => r.em.fork());

  const demos = await db
    .findOne(entity.User, query.userId, {
      fields: ['demos.uuid', 'demos.name', 'demos.brandLogo', 'demos.createdAt', 'demos.updatedAt'],
      strategy: LoadStrategy.JOINED
    })
    .then((r) => r?.demos.toJSON())
    .then((r) =>
      r?.map(({ ...demo }) => {
        return {
          ...demo,
          brandLogo: `data:${demo.brandLogo.type};base64,${new Buffer.from(demo.brandLogo.bits).toString('base64')}`
        };
      })
    );

  return { status: 200, body: { demos } };
};
