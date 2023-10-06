import type { RequestEvent } from '@sveltejs/kit';
import type { JSONObject } from '@sveltejs/kit/types/private';
import { Expose, plainToInstance } from 'class-transformer';
import { IsNotEmpty, IsUUID, validateSync } from 'class-validator';
import { LoadStrategy, MikroORM } from '@mikro-orm/core';
import { classTransformOptions, classValidationOptions } from '../../.utils';
import { User, Demo, Data } from '../../../database/entities';
import config from '../../../../mikro-orm.config';

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
          'extensionNumber',
          'sipTitle',
          'sipImage',
          'extensionNumber1',
          'sipTitle1',
          'sipImage1',
          'extensionNumber2',
          'sipTitle2',
          'sipImage2',
          'extensionNumber3',
          'sipTitle3',
          'sipImage3',
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
          sipImage,
          sipImage1,
          sipImage2,
          sipImage3,
          ...demo
        }: {
          backgroundPoster: Data;
          brandLogo: Data;
          sipImage: Data | null;
          sipImage1: Data | null;
          sipImage2: Data | null;
          sipImage3: Data | null;
        } = r;
        (demo as JSONObject)['brandLogo'] = 'data:' + brandLogo.type + ';base64,' + brandLogo.bits.toString('base64');
        (demo as JSONObject)['backgroundPoster'] =
          'data:' + backgroundPoster.type + ';base64,' + backgroundPoster.bits.toString('base64');
        (demo as JSONObject)['sipImage'] =
          sipImage != null ? 'data:' + sipImage.type + ';base64,' + sipImage.bits.toString('base64') : null;
        (demo as JSONObject)['sipImage1'] =
          sipImage1 != null ? 'data:' + sipImage1.type + ';base64,' + sipImage1.bits.toString('base64') : null;
        (demo as JSONObject)['sipImage2'] =
          sipImage2 != null ? 'data:' + sipImage2.type + ';base64,' + sipImage2.bits.toString('base64') : null;
        (demo as JSONObject)['sipImage3'] =
          sipImage3 != null ? 'data:' + sipImage3.type + ';base64,' + sipImage3.bits.toString('base64') : null;

        return {
          status: 200,
          body: { demo, role: query.role, embeddable: requestEvent.url.searchParams.has('embeddable') }
        };
      }

      return { status: 302, headers: { Location: '/auth' } };
    });
};
