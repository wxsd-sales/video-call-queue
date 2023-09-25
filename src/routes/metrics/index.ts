import type { RequestEvent } from '@sveltejs/kit';
import { Entity, LoadStrateg, MikroORM } from '@mikro-orm/core';
import { EntityRepository } from '@mikro-orm/better-sqlite';
import { Demo, User } from '../../database/entities';
import config from '../../../mikro-orm.config';

export const GET = async (requestEvent: RequestEvent) => {
  const removeDuplicates = (array) => {
    return array.filter(
      (value, index, self) => index === self.findIndex((t) => t.group === value.group && t.date === value.date)
    );
  };

  const orm = await MikroORM.init({ ...config, ...{ entities: [User, Demo] } });
  const em = orm.em.fork();

  const sdkCount = await em.count(Demo, {
    isSDK: true
  });

  const icCount = await em.count(Demo, {
    isIC: true
  });

  const sipCount = await em.count(Demo, {
    isSIP: true
  });

  const users = await em.find(User, {}, { populate: ['demos'] });
  const demos = await em.find(Demo, {});
  const userDemosData = users.map((user) => ({ name: user.email, value: user.demos.length }));

  const meetingOptionsData = [
    { group: 'SDK', value: sdkCount },
    { group: 'IC', value: icCount },
    { group: 'SIP', value: sipCount }
  ];

  const userArray = users.map((user) => ({ name: user.email, date: new Date(user.createdAt).toDateString() }));
  const userCount = {};
  let numberOfUsers = [];

  userArray.forEach((element) => {
    userCount[element.date] = (userCount[element.date] || 0) + 1;
  });
  userArray.forEach((user) => {
    numberOfUsers.push({ group: 'Users', date: user.date, value: userCount[user.date] });
  });

  numberOfUsers = removeDuplicates(numberOfUsers);
  let userTotal = 0;
  numberOfUsers = numberOfUsers.map(({ group, date, value }) => {
    userTotal += value;
    return { group, date, value: userTotal };
  });

  const demoArray = demos.map((demo) => ({ name: demo.name, date: new Date(demo.createdAt).toDateString() }));
  const demoCount = {};
  let numberOfDemos = [];

  demoArray.forEach((element) => {
    demoCount[element.date] = (demoCount[element.date] || 0) + 1;
  });
  demoArray.forEach((demo) => {
    numberOfDemos.push({ group: 'Demos', date: demo.date, value: demoCount[demo.date] });
  });

  numberOfDemos = removeDuplicates(numberOfDemos);
  let demoTotal = 0;
  numberOfDemos = numberOfDemos.map(({ group, date, value }) => {
    demoTotal += value;
    return { group, date, value: demoTotal };
  });

  return {
    status: 200,
    body: { numberOfAll: [...numberOfDemos, ...numberOfUsers], meetingOptionsData, userDemosData }
  };
};
