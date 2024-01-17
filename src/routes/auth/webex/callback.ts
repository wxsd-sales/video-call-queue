import type { RequestEvent } from '@sveltejs/kit';
import type { JSONObject } from '@sveltejs/kit/types/private';
import { Session, User } from '../../../database/entities';
import { prerendering } from '$app/env';
import env from '$lib/environment';
import * as cookie from 'cookie';
import { getUserUUID } from '$lib/webex/common';

export const GET = async (requestEvent: RequestEvent) => {
  if (requestEvent.locals.session?.user?.uuid) {
    return { status: 302, headers: { Location: '/demos' } };
  }

  const grantType = 'authorization_code';
  const code = requestEvent.url.searchParams.get('code');
  const redirectUri = (requestEvent.url.origin || env.PUBLIC_TUNNEL) + requestEvent.url.pathname;
  const state = requestEvent.url.searchParams.get('state');

  if (state !== requestEvent.locals.session?.uuid) {
    return { status: 403 };
  }

  const addExpiresAts = (obj: JSONObject, date: number = Date.now()) => ({
    ...obj,
    ...{
      expiresAt: date + (obj.expiresIn as number) * 1000,
      refreshTokenExpiresAt: date + (obj.refreshTokenExpiresIn as number) * 1000
    }
  });

  const db = requestEvent.locals.db;
  const body = `grant_type=${grantType}&client_id=${env.WEBEX_AUTHORIZATION_CODE_CLIENT_ID}&client_secret=${env.WEBEX_AUTHORIZATION_CODE_CLIENT_SECRET}&redirect_uri=${redirectUri}&code=${code}`;

  try{ 

  const token = await (await fetch(`${env.WEBEX_API_URL}/access_token` , {
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'application/x-www-form-urlencoded',
      }),
      body
    })).json();

  addExpiresAts(token, Date.parse(new Date().toUTCString()));
  const me = await (await fetch(`${env.WEBEX_API_URL}/people/me`, {
    headers: new Headers({
      'Authorization': `Bearer ${token.access_token}`,
      'Content-Type': 'application/json'
    })
  })).json();

  const user = await db?.findOne(User, { uuid: getUserUUID(me.id) })
  const session = new Session({
    user: user ?? new User(getUserUUID(me.id), me.emails[0]),
    ipAddress: prerendering ? 'unknown' : requestEvent.clientAddress,
    userAgent: requestEvent.request.headers.get('User-Agent') ?? undefined,
    lastActivityAt: Date.now(),
    payload: { webex: { ...me, orgId: me.orgId } }
  });
  const sessionCookie = cookie.serialize('sessionId', session.uuid, {
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
    sameSite: 'lax'
  });

  await db?.persistAndFlush(session);

  return {
    status: 302,
    headers: {
      'Location': `${env.PUBLIC_TUNNEL ? env.PUBLIC_TUNNEL : ''}/demos`,
      'Set-Cookie': sessionCookie
    }
  }} catch(e) {
    return { status: 403 };
  };
};

