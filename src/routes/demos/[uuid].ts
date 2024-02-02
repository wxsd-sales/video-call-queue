import 'reflect-metadata';
import type { RequestEvent } from '@sveltejs/kit';
import { Demo } from '../../database/entities';
import { LoadStrategy } from '@mikro-orm/core';
import { generateDemo } from '$lib/shared/utilities';
import { DEFAULT_SIP_CONFIG } from '$lib/constants';

const fields = [
  'uuid',
  'name',
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

/** @typedef {import('class-validator').ValidationError} ValidationError */
export const GET = async (requestEvent: RequestEvent) => {
  const demoId = requestEvent.params.uuid;
  const db = requestEvent.locals.db;
  const session = requestEvent.locals.session;

  try {
    return demoId != 'new'
      ? await db
          ?.findOneOrFail(
            Demo,
            { uuid: demoId, user: { uuid: session?.user?.uuid } },
            {
              fields,
              strategy: LoadStrategy.JOINED
            }
          )
          .then((r) => {
            return {
              status: 200,
              body: { ...generateDemo(r) }
            };
          })
          .catch({
            status: 500,
            body: { backgroundBrightness: 55, units: 'imperial', cityId: 4887398, SIPQueues: [DEFAULT_SIP_CONFIG] }
          })
      : {
          status: 200,
          body: {
            backgroundBrightness: 55,
            units: 'imperial',
            cityId: 4887398,
            SIPQueues: [DEFAULT_SIP_CONFIG]
          }
        };
  } catch (e) {
    console.error(e);
    return {
      status: 500,
      body: { backgroundBrightness: 55, units: 'imperial', cityId: 4887398, SIPQueues: [DEFAULT_SIP_CONFIG] }
    };
  }
};
