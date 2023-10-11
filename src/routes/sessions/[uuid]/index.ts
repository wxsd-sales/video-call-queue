import type { RequestEvent } from '@sveltejs/kit';
import type { JSONObject } from '@sveltejs/kit/types/private';
import { Expose, plainToInstance } from 'class-transformer';
import { IsNotEmpty, IsUUID, validateSync } from 'class-validator';
import { LoadStrategy, MikroORM } from '@mikro-orm/core';
import { classTransformOptions, classValidationOptions } from '../../.utils';
import { User, Demo, Data } from '../../../database/entities';
import config from '../../../../mikro-orm.config';

const generateSIPCardData = (title: string, extensionNumber: number, img: Data| null) => (
  title && {
    title, extensionNumber, img: img ? 'data:' + img.type + ';base64,' + img.bits.toString('base64') : null
  } 
);

export const GET = async (requestEvent: RequestEvent) => {
  class RequestQueryDTO {
    @Expose()
    @IsUUID(4)
    public readonly uuid!: string;

    @Expose()
    @IsNotEmpty()
    public readonly role!: 'responder' | 'requester';

    @Expose()
    public readonly embeddable!: false;
  }

  const searchParams = Object.fromEntries(requestEvent.url.searchParams);
  const query = plainToInstance(RequestQueryDTO, { ...requestEvent.params, ...searchParams }, classTransformOptions);
  const queryValidationErrors = validateSync(query, classValidationOptions);
  if (queryValidationErrors.length > 0) {
    return { status: 302, headers: { Location: `/auth` } };
  }

  const orm = await MikroORM.init({ ...config, ...{ entities: [User, Demo] } });
  const em = orm.em.fork();

  return await em
    .findOne(
      Demo,
      { uuid: query.uuid },
      {
        fields: [
          'uuid',
          'backgroundBrightness',
          'backgroundPoster.bits',
          'backgroundPoster.name',
          'backgroundPoster.type',
          'brandTitle',
          'brandSubtitle',
          'brandLogo.bits',
          'brandLogo.name',
          'brandLogo.type',
          'weatherUnits',
          'weatherCityId',
          'isSDK',
          'isIC',
          'isSIP',
          'extensionNumber1',
          'sipTitle1',
          'sipImage1',
          'extensionNumber2',
          'sipTitle2',
          'sipImage2',
          'extensionNumber3',
          'sipTitle3',
          'sipImage3',
          'extensionNumber4',
          'sipTitle4',
          'sipImage4',
          'displayFootnote'
        ],
        strategy: LoadStrategy.JOINED
      }
    )
    .then((r) => {
      if (r) {
        const {
          backgroundPoster,
          brandLogo,
          sipImage1,
          sipTitle1,
          extensionNumber1,
          sipTitle2,
          extensionNumber2,
          sipImage2,
          sipTitle3,
          extensionNumber3,
          sipImage3,
          sipTitle4,
          extensionNumber4,
          sipImage4,
          ...demo
        }: {
          backgroundPoster: Data;
          brandLogo: Data;
          sipImage1: Data | null;
          sipImage2: Data | null;
          sipImage3: Data | null;
          sipImage4: Data | null;
          sipTitle1: string,
          extensionNumber1: number,
          sipTitle2: string,
          extensionNumber2: number,
          sipTitle3: string,
          extensionNumber3: number,
          sipTitle4: string,
          extensionNumber4: number,
        } = r;
        (demo as JSONObject)['brandLogo'] = 'data:' + brandLogo.type + ';base64,' + brandLogo.bits.toString('base64');
        (demo as JSONObject)['backgroundPoster'] =
          'data:' + backgroundPoster.type + ';base64,' + backgroundPoster.bits.toString('base64');
        (demo as JSONObject)['sipQueues'] = [
          generateSIPCardData(sipTitle1, extensionNumber1, sipImage1),
          generateSIPCardData(sipTitle2, extensionNumber2, sipImage2),
          generateSIPCardData(sipTitle3, extensionNumber3, sipImage3),
          generateSIPCardData(sipTitle4, extensionNumber4, sipImage4)
        ].filter(Boolean);

        demo.sipQueues = demo.sipQueues.length ? demo.sipQueues : null;
        return {
          status: 200,
          body: { demo, role: query.role, embeddable: requestEvent.url.searchParams.has('embeddable') }
        };
      }

      return { status: 302, headers: { Location: '/auth' } };
    });
};
