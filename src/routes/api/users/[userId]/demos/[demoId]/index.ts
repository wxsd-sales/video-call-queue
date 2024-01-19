import type { RequestEvent, RequestHandler } from '@sveltejs/kit';
import * as entity from '../../../../../../database/entities';
import config from '../../../../../../../mikro-orm.config';
import { MikroORM } from '@mikro-orm/core';
import type { EntityManager } from '@mikro-orm/core';
import { LoadStrategy } from '@mikro-orm/core';
import { generateDemo } from '$lib/shared/utilities';
import type { Demo } from 'src/database/entities/demo';

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

const toData = async (file: File) => {
  return new entity.Data({
    bits: Buffer.from(await file.arrayBuffer()),
    type: file.type,
    name: file.name,
    lastModified: file.lastModified
  });
};
const getDB = async () =>
  await MikroORM.init({
    ...config,
    ...{ entities: [entity.Session, entity.User, entity.Data, entity.Demo] }
  }).then((r) => r.em.fork());

const findDemo = async (db: EntityManager, demoId: string, userId: string) => {
  return await db.findOne(
    entity.Demo,
    { uuid: demoId, user: { uuid: userId } },
    { fields, strategy: LoadStrategy.JOINED }
  );
};

export const POST: RequestHandler = async (requestEvent: RequestEvent) => {
  try {
    const formData = await requestEvent.request.formData();
    const form = (
      await Promise.all(
        [...formData.entries()].map(async (field) => {
          //Check if its a file or not
          field[1] = field[1] instanceof Object ? await toData(field[1]) : JSON.parse(field[1]);
          return field;
        })
      )
    ).reduce((acc: Demo, curr) => {
      acc[curr[0]] = curr[1];
      return acc;
    }, {} as Demo);

    const db = await getDB();
    const user = await db.findOne(entity.User, { uuid: requestEvent.params.userId }, { strategy: LoadStrategy.JOINED });

    const demo = new entity.Demo({ ...form, user });
    await db.persistAndFlush(demo);

    return { status: 200, body: { ...generateDemo(demo), uuid: demo.uuid } };
  } catch (e) {
    return { status: 500 };
  }
};

export const PUT = async (requestEvent: RequestEvent) => {
  const formData = await requestEvent.request.formData();
  const form = await Promise.all(
    [...formData.entries()].map(async (field) => {
      //Check if its a file or not
      field[1] = field[1] instanceof Object ? await toData(field[1]) : JSON.parse(field[1]);
      return field;
    })
  );

  try {
    const db = await getDB();
    const demo = await findDemo(db, requestEvent.params.demoId, requestEvent.params.userId);

    form.forEach((curr) => (demo[curr[0]] = curr[1]));
    await db.persistAndFlush(demo as Demo);

    return { status: 200, body: { ...generateDemo(demo), uuid: demo.uuid } };
  } catch (e) {
    return { status: 500 };
  }
};

export const PATCH = async (requestEvent: RequestEvent) => {
  const body = await requestEvent.request.json();

  try {
    const db = await getDB();
    let demo = await findDemo(db, requestEvent.params.demoId, requestEvent.params.userId);

    demo = Object.keys(body).reduce((acc, curr) => {
      acc[curr] = body[curr];
      return acc;
    }, demo);
    await db.persistAndFlush(demo as Demo);

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
