import type { RequestEvent } from '@sveltejs/kit';
import { User } from '../../../../../database/entities';
import * as entity from '../../../../../database/entities';
import config from '../../../../../../mikro-orm.config';
import { LoadStrategy, MikroORM } from '@mikro-orm/core';

export const GET: RequestHandler = async (requestEvent: RequestEvent) => {
  // class RequestQueryDTO {
  //   @Expose()
  //   public readonly data!: string;
  // }

  // class ResponseDTO implements ToJSON {
  //   @Expose()
  //   public readonly token!: string;

  //   toJSON(): Exclude<JSONValue, ToJSON> {
  //     return instanceToPlain(this);
  //   }
  // }

  // const searchParams = Object.fromEntries(requestEvent.url.searchParams);
  // const query = plainToInstance(RequestQueryDTO, searchParams, classTransformOptions);
  // const queryValidationErrors = validateSync(query, classValidationOptions);
  // if (queryValidationErrors.length > 0) {
  //   return { status: 400, body: { query: queryValidationErrors } };
  // }
  const { userId } = requestEvent.params;
  const db = await MikroORM.init({
    ...config,
    ...{ entities: [entity.Session, entity.User, entity.Data, entity.Demo] }
  }).then((r) => r.em.fork());

  const demos = await db
    .findOne(User, userId, {
      fields: ['demos.uuid', 'demos.name', 'demos.createdAt', 'demos.updatedAt'],
      strategy: LoadStrategy.JOINED
    })
    .then((r) => r?.demos.toJSON())
    .then((r) => r?.map(({ ...demo }) => demo));

  return { status: 200, body: { demos } };
};
