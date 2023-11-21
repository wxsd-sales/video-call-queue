import type { RequestEvent } from '@sveltejs/kit';
import { VALID_DOMAINS } from '$lib/constants';

export const GET = async (requestEvent: RequestEvent) => {
  if (VALID_DOMAINS.some((domain) => domain.startsWith(requestEvent.url.origin)))
    return { status: 302, headers: { Location: '/auth' } };
};
