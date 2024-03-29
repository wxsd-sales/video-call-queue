import type { RequestEvent } from '@sveltejs/kit';
import { wrap } from '@mikro-orm/core';
import * as cookie from 'cookie';

export const POST = async (requestEvent: RequestEvent) => {
  const db = requestEvent.locals.db;

  try {
    if (db && requestEvent.locals.session?.uuid && requestEvent.locals.session.user?.uuid) {
      const session = cookie.serialize('sessionId', '', { path: '/', maxAge: -1, sameSite: 'strict' });

      return await db.persistAndFlush(wrap(requestEvent.locals.session).assign({ isExpired: true })).then(() => ({
        status: 302,
        headers: { 'Location': '/auth', 'Set-Cookie': session }
      }));
    }

    return { status: 422 };
  } catch (e) {
    console.error(e);
    return { status: 422 };
  }
};
