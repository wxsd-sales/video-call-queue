import type { RequestEvent } from '@sveltejs/kit';
import { Entity, LoadStrateg, MikroORM } from '@mikro-orm/core';
import { EntityRepository } from '@mikro-orm/better-sqlite';
import { Demo, User } from '../../database/entities';
import config from '../../../mikro-orm.config';

const groupByDate = (items: Array<any>, group) => {
  items.sort((a: User, b: User) => new Date(a.createdAt) - new Date(b.createdAt));
  const data = items.reduce((groups, item) => {
    (groups[new Date(item.createdAt).toDateString()] ||= []).push(1);
    return groups;
  }, {});

  let value = 0;
  return Object.keys(data).map((date) => {
    value += data[date].length;
    return { group, date, value };
  });
};

const populateTree = (users: Array<User>, url: string) => {
  const data = users.map((user) => {
    const children = user.demos.map(({ uuid, name }) => ({
      name: `${url}/sessions/${uuid}?role=requester`
    }));

    return { name: user.email, children };
  });

  return data;
};

export const GET = async (requestEvent: RequestEvent) => {
  const orm = await MikroORM.init({ ...config, ...{ entities: [User, Demo] } });
  const em = orm.em.fork();

  const users = await em.find(User, {}, { populate: ['demos'] });
  const demos = await em.find(Demo, {});
  const userDemosData = users.map((user) => ({ name: user.email, value: user.demos.length }));

  const treeData = populateTree(users, requestEvent.url.origin);
  return {
    status: 200,
    body: { numberOfAll: [...groupByDate(demos, 'Demos'), ...groupByDate(users, 'Users')], userDemosData, treeData }
  };
};
