import type { RequestEvent, RequestHandler } from '@sveltejs/kit';
import * as entity from '../../../../../database/entities';
import config from '../../../../../../mikro-orm.config';
import { LoadStrategy, MikroORM } from '@mikro-orm/core';
import { Expose, plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';

const fields = [
  'demos.uuid',
  'demos.name',
  'demos.backgroundBrightness',
  'demos.backgroundPoster.bits',
  'demos.backgroundPoster.name',
  'demos.backgroundPoster.type',
  'demos.backgroundPoster.lastModified',
  'demos.brandLogo.bits',
  'demos.brandLogo.name',
  'demos.brandLogo.type',
  'demos.brandLogo.lastModified',
  'demos.weatherUnits',
  'demos.weatherCityId',
  'demos.videoLink1',
  'demos.extensionNumber1',
  'demos.sipTitle1',
  'demos.sipImage1',
  'demos.videoLink2',
  'demos.extensionNumber2',
  'demos.sipTitle2',
  'demos.sipImage2',
  'demos.videoLink3',
  'demos.extensionNumber3',
  'demos.sipTitle3',
  'demos.sipImage3',
  'demos.videoLink4',
  'demos.extensionNumber4',
  'demos.sipTitle4',
  'demos.sipImage4',
  'demos.displayFootnote',
  'demos.displayWeather'
];
const generateSIPQueues = (demo) => {
  const queues = [];
  for (let i = 1; i <= 4; i++) {
    if (demo[`videoLink${i}`])
      queues.push({ videoLink: demo[`videoLink${i}`], extensionNumber: demo[`extensionNumber${i}`] });
  }

  return queues;
};
export const GET: RequestHandler = async (requestEvent: RequestEvent) => {
  class RequestQueryDTO {
    @Expose()
    public readonly userId!: string;
  }

  const query = plainToInstance(RequestQueryDTO, requestEvent.params);
  const queryValidationErrors = validateSync(query);
  if (queryValidationErrors.length > 0) {
    return { status: 400, body: { query: queryValidationErrors } };
  }
  const db = await MikroORM.init({
    ...config,
    ...{ entities: [entity.Session, entity.User, entity.Data, entity.Demo] }
  }).then((r) => r.em.fork());

  try {
    const db = await MikroORM.init({
      ...config,
      ...{ entities: [entity.Session, entity.User, entity.Data, entity.Demo] }
    }).then((r) => r.em.fork());

    const demos = await db
      .findOne(entity.User, query.userId, {
        fields,
        strategy: LoadStrategy.JOINED
      })
      .then((r) => r?.demos.toJSON())
      .then((r) =>
        r?.map(({ ...demo }) => {
          return {
            ...demo,
            SIPQueues: generateSIPQueues(demo),
            brandLogo: `data:${demo.brandLogo.type};base64,${new Buffer.from(demo.brandLogo.bits).toString('base64')}`
          };
        })
      );

    return { status: 200, body: { demos } };
  } catch (e) {
    console.error(e);
    return { status: 500, body: { error: e } };
  }
};
