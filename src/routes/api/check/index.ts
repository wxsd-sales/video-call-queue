import 'reflect-metadata';
import type { RequestEvent, RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async (requestEvent: RequestEvent) => ({
  status: 200,
  statusMessage: 'OK',
  body: 'Ok'
});
