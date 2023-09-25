import { localStorage, sessionStorage, storage } from './shared/storage';
import { StateKey } from './enums';
import type { TokenResponse } from './types';

export const tokenResponseStore = localStorage<TokenResponse>(StateKey.WEBEX_TOKEN);
export const queueOrderStore = sessionStorage<number>(StateKey.QUEUE_ORDER);
export const requesterIDStore = sessionStorage<string>(StateKey.REQUESTER_ID);
export const SIPQueuesStore = localStorage<Array<unknown>>(StateKey.SIP_QUEUES);
