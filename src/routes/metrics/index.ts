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
  const demos = await em.find(Demo, {});

  const userDemosData = users.map((user) => ({ name: user.email, value: user.demos.length }));

  const meetingOptionsData = [
    { group: 'SDK', value: sdkCount },
    { group: 'IC', value: icCount },
    { group: 'SDK & IC', value: sdkPlusIC }
  ];

  const userArray = users.map((user) => ({ name: user.email, date: new Date(user.createdAt).toDateString() }));
  const userCount = {};
  const numberOfUsers = [];
  userArray.forEach((element) => {
    userCount[element.date] = (userCount[element.date] || 0) + 1;
  });
  userArray.forEach((user) => {
    numberOfUsers.push({ group: 'Users', date: user.date, value: userCount[user.date] });
  });

  const demoArray = demos.map((demo) => ({ name: demo.name, date: new Date(demo.createdAt).toDateString() }));
  const demoCount = {};
  const numberOfDemos = [];
  demoArray.forEach((element) => {
    demoCount[element.date] = (demoCount[element.date] || 0) + 1;
  });
  demoArray.forEach((demo) => {
    numberOfUsers.push({ group: 'Demos', date: demo.date, value: demoCount[demo.date] });
  });

  return { status: 200, body: { meetingOptionsData, userDemosData, numberOfUsers, numberOfDemos } };
};
