import type { RequestEvent } from '@sveltejs/kit';
import type { JSONObject } from '@sveltejs/kit/types/private';
import { Expose, plainToInstance } from 'class-transformer';
import { IsUUID, validateSync } from 'class-validator';
import { LoadStrategy, MikroORM } from '@mikro-orm/core';
import { User, Demo, Data } from '../../../database/entities';
import config from '../../../../mikro-orm.config';
import { classTransformOptions, classValidationOptions } from '../../.utils';

const generateSIPCardData = (title: string, videoLink: string, extensionNumber: number, img: Data | null) =>
  title &&
  extensionNumber &&
  videoLink && {
    title,
    extensionNumber,
    img: img ? 'data:' + img.type + ';base64,' + img.bits.toString('base64') : null
  };

export const GET = async (requestEvent: RequestEvent) => {
  class RequestQueryDTO {
    @Expose()
    @IsUUID(4)
    public readonly uuid!: string;
  }

  const searchParams = Object.fromEntries(requestEvent.url.searchParams);
  const query = plainToInstance(RequestQueryDTO, { ...requestEvent.params, ...searchParams }, classTransformOptions);
  const queryValidationErrors = validateSync(query, classValidationOptions);
  if (queryValidationErrors.length > 0) {
    return { status: 302, headers: { Location: `/auth` } };
  }

  try {
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
            'extensionNumber1',
            'sipTitle1',
            'sipImage1',
            'videoLink1',
            'extensionNumber2',
            'sipTitle2',
            'videoLink2',
            'sipImage2',
            'extensionNumber3',
            'sipTitle3',
            'videoLink3',
            'sipImage3',
            'extensionNumber4',
            'sipTitle4',
            'videoLink4',
            'sipImage4',
            'displayFootnote',
            'displayWeather'
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
            videoLink1,
            sipTitle2,
            extensionNumber2,
            videoLink2,
            sipImage2,
            sipTitle3,
            extensionNumber3,
            sipImage3,
            videoLink3,
            sipTitle4,
            extensionNumber4,
            sipImage4,
            videoLink4,
            ...demo
          }: {
            backgroundPoster: Data;
            brandLogo: Data;
            sipImage1: Data | null;
            sipImage2: Data | null;
            sipImage3: Data | null;
            sipImage4: Data | null;
            videoLink1: string;
            videoLink2: string;
            videoLink3: string;
            videoLink4: string;
            sipTitle1: string;
            extensionNumber1: number;
            sipTitle2: string;
            extensionNumber2: number;
            sipTitle3: string;
            extensionNumber3: number;
            sipTitle4: string;
            extensionNumber4: number;
          } = r;
          (demo as JSONObject)['brandLogo'] = 'data:' + brandLogo.type + ';base64,' + brandLogo.bits.toString('base64');
          (demo as JSONObject)['backgroundPoster'] =
            'data:' + backgroundPoster.type + ';base64,' + backgroundPoster.bits.toString('base64');
          (demo as JSONObject)['queues'] = [
            generateSIPCardData(sipTitle1, videoLink1, extensionNumber1, sipImage1),
            generateSIPCardData(sipTitle2, videoLink2, extensionNumber2, sipImage2),
            generateSIPCardData(sipTitle3, videoLink3, extensionNumber3, sipImage3),
            generateSIPCardData(sipTitle4, videoLink4, extensionNumber4, sipImage4)
          ].filter(Boolean);

          demo.queues = demo.queues.length ? demo.queues : null;
          demo.isSIP = demo.isSIP && demo.queues?.length;

          return {
            status: 200,
            body: { demo, role: query.role }
          };
        }
        return { status: 302, headers: { Location: '/auth' } };
      });
  } catch (e) {
    console.error(e);
    return { status: 302, headers: { Location: '/auth' } };
  }
};
