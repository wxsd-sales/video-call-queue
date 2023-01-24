import type { RequestEvent } from '@sveltejs/kit';
import { Entity, LoadStrateg, MikroORM } from '@mikro-orm/core';
import { EntityRepository } from '@mikro-orm/better-sqlite';
import { Demo, User } from '../../database/entities';
import { MEETING_TYPE_OPTIONS } from '$lib/enums';
import config from '../../../mikro-orm.config';

export const GET = async (requestEvent: RequestEvent) => {
  const orm = await MikroORM.init({ ...config, ...{ entities: [User, Demo] } });
  const em = orm.em.fork();

  const sdkCount = await em.count(Demo, {
    isSDK: true,
    isIC: false
  });

  const icCount = await em.count(Demo, {
    isIC: true,
    isSDK: false
  });

  const sdkPlusIC = await em.count(Demo, {
    isIC: true,
    isSDK: true
  });

  const users = await em.find(User, {}, { populate: ['demos'] });

  const userDemosData = users.map((user) => ({ name: user.email, value: user.demos.length }));

  const meetingOptionsData = [
    { group: 'SDK', value: sdkCount },
    { group: 'IC', value: icCount },
    { group: 'SDK & IC', value: sdkPlusIC }
  ];

  const array = users.map((user) => ({ name: user.email, date: new Date(user.createdAt).getDate() }));
  const userCount = {};
  array.forEach((element) => {
    userCount[element.date] = (userCount[element.date] || 0) + 1;
  });

  const numberOfUsers = [
    { group: 'Users', date: new Date(2023, 1, 23), value: userCount['23'] },
    { group: 'Users', date: new Date(2023, 1, 24), value: userCount['24'] || null },
    { group: 'Users', date: new Date(2023, 1, 25), value: userCount['25'] || null },
    { group: 'Users', date: new Date(2023, 1, 26), value: userCount['26'] || null },
    { group: 'Users', date: new Date(2023, 1, 27), value: userCount['27'] || null },
    { group: 'Users', date: new Date(2023, 1, 28), value: userCount['28'] || null },
    { group: 'Users', date: new Date(2023, 1, 29), value: userCount['29'] || null },
    { group: 'Users', date: new Date(2023, 1, 30), value: userCount['30'] || null },
    { group: 'Users', date: new Date(2023, 1, 31), value: userCount['31'] || null },
    { group: 'Users', date: new Date(2023, 2, 1), value: userCount['1'] || null },
    { group: 'Users', date: new Date(2023, 2, 2), value: userCount['2'] || null },
    { group: 'Users', date: new Date(2023, 2, 3), value: userCount['3'] || null },
    { group: 'Users', date: new Date(2023, 2, 4), value: userCount['4'] || null },
    { group: 'Users', date: new Date(2023, 2, 5), value: userCount['5'] || null },
    { group: 'Users', date: new Date(2023, 2, 6), value: userCount['6'] || null },
    { group: 'Users', date: new Date(2023, 2, 7), value: userCount['7'] || null },
    { group: 'Users', date: new Date(2023, 2, 8), value: userCount['8'] || null },
    { group: 'Users', date: new Date(2023, 2, 9), value: userCount['9'] || null },
    { group: 'Users', date: new Date(2023, 2, 10), value: userCount['10'] || null },
    { group: 'Users', date: new Date(2023, 2, 11), value: userCount['11'] || null },
    { group: 'Users', date: new Date(2023, 2, 12), value: userCount['12'] || null },
    { group: 'Users', date: new Date(2023, 2, 13), value: userCount['13'] || null },
    { group: 'Users', date: new Date(2023, 2, 14), value: userCount['14'] || null },
    { group: 'Users', date: new Date(2023, 2, 15), value: userCount['15'] || null },
    { group: 'Users', date: new Date(2023, 2, 16), value: userCount['16'] || null },
    { group: 'Users', date: new Date(2023, 2, 17), value: userCount['17'] || null },
    { group: 'Users', date: new Date(2023, 2, 18), value: userCount['18'] || null },
    { group: 'Users', date: new Date(2023, 2, 19), value: userCount['19'] || null },
    { group: 'Users', date: new Date(2023, 2, 20), value: userCount['20'] || null },
    { group: 'Users', date: new Date(2023, 2, 21), value: userCount['21'] || null }
  ];

  return { status: 200, body: { meetingOptionsData, userDemosData, numberOfUsers } };
};
