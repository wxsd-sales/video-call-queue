import type { RequestEvent, RequestHandler } from '@sveltejs/kit';
import * as entity from '../../../../../../database/entities';
import config from '../../../../../../../mikro-orm.config';
import { MikroORM } from '@mikro-orm/core';
import { LoadStrategy } from '@mikro-orm/core';
import { generateDemo } from '$lib/shared/utilities';

const toData = async (file: File) =>
  new entity.Data({
    bits: Buffer.from(await file.arrayBuffer()),
    type: file.type,
    name: file.name,
    lastModified: file.lastModified
  });

const fields = [
  'uuid',
  'name',
  'user',
  'backgroundBrightness',
  'backgroundPoster.bits',
  'backgroundPoster.name',
  'backgroundPoster.type',
  'backgroundPoster.lastModified',
  'brandLogo.bits',
  'brandLogo.name',
  'brandLogo.type',
  'brandLogo.lastModified',
  'weatherUnits',
  'weatherCityId',
  'videoLink1',
  'extensionNumber1',
  'sipTitle1',
  'sipImage1',
  'videoLink2',
  'extensionNumber2',
  'sipTitle2',
  'sipImage2',
  'videoLink3',
  'extensionNumber3',
  'sipTitle3',
  'sipImage3',
  'videoLink4',
  'extensionNumber4',
  'sipTitle4',
  'sipImage4',
  'displayFootnote',
  'displayWeather'
];

export const POST: RequestHandler = async (requestEvent: RequestEvent) => {
  try {
    const isFile = ['backgroundPoster', 'brandLogo', 'sipImage1', 'sipImage2', 'sipImage3', 'sipImage4'];
    const formData = await requestEvent.request.formData();
    const form = (
      await Promise.all(
        [...formData.entries()].map(async (field) => {
          if (isFile.includes(field[0])) field[1] = await toData(field[1]);

          return field;
        })
      )
    ).reduce((acc, curr) => {
      acc[curr[0]] = curr[1];
      return acc;
    }, {});

    const db = await MikroORM.init({
      ...config,
      ...{ entities: [entity.Session, entity.User, entity.Data, entity.Demo] }
    }).then((r) => r.em.fork());

    const user = await db.findOne(entity.User, { uuid: requestEvent.params.userId }, { strategy: LoadStrategy.JOINED });

    const demo = new entity.Demo({ ...form, user });
    await db.persistAndFlush(demo);

    return { status: 200, body: { ...generateDemo(demo), uuid: demo.uuid } };
  } catch (e) {
    return { status: 500 };
  }
};

export const PATCH = async (requestEvent: RequestEvent) => {
  try {
    const isFile = ['backgroundPoster', 'brandLogo', 'sipImage1', 'sipImage2', 'sipImage3', 'sipImage4'];
    const formData = await requestEvent.request.formData();
    const form = await Promise.all(
      [...formData.entries()].map(async (field) => {
        if (isFile.includes(field[0])) field[1] = await toData(field[1]);

        if (field[1] == 'true') field[1] = true;
        if (field[1] == 'false') field[1] = false;

        return field;
      })
    );

    const db = await MikroORM.init({
      ...config,
      ...{ entities: [entity.Session, entity.User, entity.Data, entity.Demo] }
    }).then((r) => r.em.fork());

    const demo = await db.findOne(
      entity.Demo,
      { uuid: requestEvent.params.demoId, user: { uuid: requestEvent.params.userId } },
      { fields, strategy: LoadStrategy.JOINED }
    );

    form.forEach((curr) => (demo[curr[0]] = curr[1]));

    await db.persistAndFlush(demo);

    return { status: 200, body: { ...generateDemo(demo), uuid: demo.uuid } };
  } catch (e) {
    return { status: 500 };
  }
};

export const DELETE = async (requestEvent: RequestEvent) => {
  try {
    const demoId = requestEvent.params.demoId;

    const db = await MikroORM.init({
      ...config,
      ...{ entities: [entity.Session, entity.User, entity.Data, entity.Demo] }
    }).then((r) => r.em.fork());

    await db.findOne(entity.Demo, demoId).then((r) => db.removeAndFlush(r));

    return { status: 204 };
  } catch (e) {
    return { status: 500 };
  }
};
