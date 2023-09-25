import 'reflect-metadata';
import type { RequestEvent } from '@sveltejs/kit';
import { Expose, Transform, plainToInstance } from 'class-transformer';
import {
  IsIn,
  IsInt,
  IsNotEmpty,
  IsUrl,
  IsUUID,
  Max,
  MaxLength,
  Min,
  MinLength,
  ValidateIf,
  validateSync
} from 'class-validator';
import { Data, Demo } from '../../../database/entities';
import { jsonRequest } from '$lib/shared/json-request';
import { classTransformOptions, classValidationOptions } from '../../.utils';
import env from '$lib/environment';
import { LoadStrategy } from '@mikro-orm/core';

/** @typedef {import('class-validator').ValidationError} ValidationError */

export const GET = async (requestEvent: RequestEvent) => {
  const demoId = requestEvent.url.searchParams.get('id');
  const db = requestEvent.locals.db;
  const session = requestEvent.locals.session;

  return demoId != null
    ? await db
        ?.findOneOrFail(
          Demo,
          { uuid: demoId, user: { uuid: session?.user?.uuid } },
          {
            fields: [
              'uuid',
              'name',
              'description',
              'backgroundBrightness',
              'backgroundPoster.bits',
              'backgroundPoster.name',
              'backgroundPoster.type',
              'backgroundPoster.lastModified',
              'brandTitle',
              'brandSubtitle',
              'brandLogo.bits',
              'brandLogo.name',
              'brandLogo.type',
              'brandLogo.lastModified',
              'weatherUnits',
              'weatherCityId',
              'isSDK',
              'isIC',
              'isSIP',
              'extensionNumber',
              'videoLink',
              'sipTitle',
              'extensionNumber1',
              'videoLink1',
              'sipTitle1',
              'extensionNumber2',
              'videoLink2',
              'sipTitle2',
              'extensionNumber3',
              'videoLink3',
              'sipTitle3',
              'displayFootnote'
            ],
            strategy: LoadStrategy.JOINED
          }
        )
        .then((r) => ({
          status: 200,
          body: {
            name: r.name,
            description: r.description,
            poster: {
              bits: 'data:' + r.backgroundPoster.type + ';base64,' + r.backgroundPoster.bits.toString('base64'),
              name: r.backgroundPoster.name,
              lastModified: r.backgroundPoster.lastModified,
              type: r.backgroundPoster.type
            },
            brightness: r.backgroundBrightness,
            logo: {
              bits: 'data:' + r.brandLogo.type + ';base64,' + r.brandLogo.bits.toString('base64'),
              name: r.brandLogo.name,
              lastModified: r.brandLogo.lastModified,
              type: r.brandLogo.type
            },
            title: r.brandTitle,
            subtitle: r.brandSubtitle,
            cityId: r.weatherCityId,
            units: r.weatherUnits,
            isSDK: r.isSDK,
            isIC: r.isIC,
            isSIP: r.isSIP,
            SIPQueues: [
              {
                extensionNumber: r.extensionNumber,
                videoLink: r.videoLink,
                sipTitle: r.sipTitle || 'Looking for Assistance?'
              },
              r?.extensionNumber1 && {
                extensionNumber: r.extensionNumber1,
                videoLink: r.videoLink1,
                sipTitle: r.sipTitle1
              },
              r?.extensionNumber2 && {
                extensionNumber: r.extensionNumber2,
                videoLink: r.videoLink2,
                sipTitle: r.sipTitle2
              },
              r.extensionNumber3 && {
                extensionNumber: r.extensionNumber3,
                videoLink: r.videoLink3,
                sipTitle: r.sipTitle3
              },
            ].filter(Boolean),
            displayFootnote: Boolean(r.displayFootnote)
          }
        }))
        .catch(({
          status: 200,
          body: { brightness: 55, title: 'Cisco', subtitle: 'Bridge to Possible', units: 'imperial', cityId: 4887398 }
        }))
    : {
        status: 200,
        body: { brightness: 55, title: 'Cisco', subtitle: 'Bridge to Possible', units: 'imperial', cityId: 4887398 }
      };
};

export const POST = async (requestEvent: RequestEvent) => {
  class RequestFormDataDTO {
    @Expose()
    @IsNotEmpty()
    @MinLength(6)
    @MaxLength(64)
    @Transform(({ obj }: { obj: FormData }) => obj.get('name'), { toClassOnly: true })
    public readonly name!: string;

    @Expose()
    @MaxLength(256)
    @ValidateIf(({ obj }) => obj?.description)
    @Transform(({ obj }: { obj: FormData }) => obj.get('description'), { toClassOnly: true })
    public readonly description?: string;

    @Expose()
    @Transform(({ obj }: { obj: FormData }) => obj.get('poster'), { toClassOnly: true })
    public readonly poster!: File;

    @Expose()
    @IsInt()
    @Min(0)
    @Max(100)
    @Transform(({ obj }: { obj: FormData }) => Number(obj.get('brightness')), { toClassOnly: true })
    public readonly brightness!: number;

    @Expose()
    @Transform(({ obj }: { obj: FormData }) => obj.get('logo'), { toClassOnly: true })
    public readonly logo!: File;

    @Expose()
    @IsNotEmpty()
    @MaxLength(16)
    @Transform(({ obj }: { obj: FormData }) => obj.get('title'), { toClassOnly: true })
    public readonly title!: string;

    @Expose()
    @IsNotEmpty()
    @MaxLength(64)
    @Transform(({ obj }: { obj: FormData }) => obj.get('subtitle'), { toClassOnly: true })
    public readonly subtitle!: string;

    @Expose()
    @Transform(({ obj }: { obj: FormData }) => Boolean(obj.get('SDK')), { toClassOnly: true })
    public readonly isSDK!: boolean;

    @Expose()
    @Transform(({ obj }: { obj: FormData }) => Boolean(obj.get('IC')), { toClassOnly: true })
    public readonly isIC!: boolean;

    @Expose()
    @Transform(({ obj }: { obj: FormData }) => Boolean(obj.get('SIP')), { toClassOnly: true })
    public readonly isSIP!: boolean;

    @Expose()
    @IsIn(['imperial', 'metric', 'standard', null])
    @Transform(({ obj }: { obj: FormData }) => obj.get('units'), { toClassOnly: true })
    public readonly units!: 'imperial' | 'metric' | 'standard' | null;

    @Expose()
    @IsInt()
    @Transform(({ obj }: { obj: FormData }) => Number(obj.get('cityId')), { toClassOnly: true })
    public readonly cityId!: number;

    @Expose()
    @IsInt()
    @Transform(({ obj }: { obj: FormData }) => Number(obj.get('extensionNumber')), { toClassOnly: true })
    public readonly extensionNumber!: number;

    @Expose()
    @Transform(({ obj }: { obj: FormData }) => obj.get('videoLink'), { toClassOnly: true })
    public readonly videoLink!: string;

    @Expose()
    @Transform(({ obj }: { obj: FormData }) => obj.get('sipTitle'), { toClassOnly: true })
    public readonly sipTitle!: string;

    @Expose()
    @IsInt()
    @Transform(({ obj }: { obj: FormData }) => Number(obj.get('extensionNumber1')), { toClassOnly: true })
    public readonly extensionNumber1!: number;

    @Expose()
    @Transform(({ obj }: { obj: FormData }) => obj.get('videoLink1'), { toClassOnly: true })
    public readonly videoLink1!: string;

    @Expose()
    @Transform(({ obj }: { obj: FormData }) => obj.get('sipTitle1'), { toClassOnly: true })
    public readonly sipTitle1!: string;

    @Expose()
    @IsInt()
    @Transform(({ obj }: { obj: FormData }) => Number(obj.get('extensionNumber2')), { toClassOnly: true })
    public readonly extensionNumber2!: number;

    @Expose()
    @Transform(({ obj }: { obj: FormData }) => obj.get('videoLink2'), { toClassOnly: true })
    public readonly videoLink2!: string;

    @Expose()
    @Transform(({ obj }: { obj: FormData }) => obj.get('sipTitle2'), { toClassOnly: true })
    public readonly sipTitle2!: string;

    @Expose()
    @IsInt()
    @Transform(({ obj }: { obj: FormData }) => Number(obj.get('extensionNumber3')), { toClassOnly: true })
    public readonly extensionNumber3!: number;

    @Expose()
    @Transform(({ obj }: { obj: FormData }) => obj.get('videoLink3'), { toClassOnly: true })
    public readonly videoLink3!: string;

    @Expose()
    @Transform(({ obj }: { obj: FormData }) => obj.get('sipTitle3'), { toClassOnly: true })
    public readonly sipTitle3!: string;

    @Expose()
    @Transform(({ obj }: { obj: FormData }) => Boolean(obj.get('footnote')), { toClassOnly: true })
    public readonly displayFootnote!: boolean;

  }

  const formData = plainToInstance(RequestFormDataDTO, await requestEvent.request.formData(), classTransformOptions);
  const formDataValidationErrors = validateSync(formData, classValidationOptions);
  if (formDataValidationErrors.length > 0) {
    return { status: 422, body: { form: 'Invalid submission.' }, headers: { Location: '/demos/create' } };
  }

  if(formData.cityId) {
    const isCityIdValid = await jsonRequest(env.OPENWEATHERMAP_API_URL)
      .get('weather', { appid: env.OPENWEATHERMAP_API_KEY, id: formData.cityId })
      .then(() => true)
      .catch(() => false);
    if (isCityIdValid === false) {
      return { status: 422, body: { form: 'Invalid submission.' }, headers: { Location: '/demos/create' } };
    }
  }

  try {
    const db = requestEvent.locals.db;
    const session = requestEvent.locals.session;
    if (db && session?.uuid && session?.user?.uuid) {
      const demo = new Demo({
        user: session.user,
        name: formData.name,
        description: formData?.description,
        backgroundPoster: new Data({
          bits: Buffer.from(await formData.poster.arrayBuffer()),
          type: formData.poster.type,
          name: formData.poster.name,
          lastModified: formData.poster.lastModified
        }),
        backgroundBrightness: formData.brightness,
        brandLogo: new Data({
          bits: Buffer.from(await formData.logo.arrayBuffer()),
          type: formData.logo.type,
          name: formData.logo.name,
          lastModified: formData.logo.lastModified
        }),
        brandTitle: formData.title,
        brandSubtitle: formData.subtitle,
        weatherUnits: formData.units,
        weatherCityId: formData.cityId,
        isSDK: formData.isSDK,
        isIC: formData.isIC,
        isSIP: formData.isSIP,
        videoLink: formData.videoLink,
        extensionNumber: formData.extensionNumber,
        sipTitle: formData.sipTitle,
        videoLink1: formData.videoLink1,
        extensionNumber1: formData.extensionNumber1,
        sipTitle1: formData.sipTitle1,
        videoLink2: formData.videoLink2,
        extensionNumber2: formData.extensionNumber2,
        sipTitle2: formData.sipTitle2,
        videoLink3: formData.videoLink3,
        extensionNumber3: formData.extensionNumber3,
        sipTitle3: formData.sipTitle3,
        displayFootnote: formData.displayFootnote
      });
      await db.persistAndFlush(demo);

      return { status: 302, headers: { Location: '/demos' } };
    }
    return { status: 422 };
  } catch (e) {
    console.log(e);
  }
};

export const PATCH = async (requestEvent: RequestEvent) => {
  class RequestFormDataDTO {
    @Expose()
    @IsNotEmpty()
    @IsUUID(4)
    @Transform(({ obj }: { obj: FormData }) => obj.get('id'), { toClassOnly: true })
    public readonly id!: string;

    @Expose()
    @IsNotEmpty()
    @MinLength(6)
    @MaxLength(64)
    @Transform(({ obj }: { obj: FormData }) => obj.get('name'), { toClassOnly: true })
    public readonly name!: string;

    @Expose()
    @MaxLength(256)
    @ValidateIf(({ obj }) => obj?.description)
    @Transform(({ obj }: { obj: FormData }) => obj.get('description'), { toClassOnly: true })
    public readonly description?: string;

    @Expose()
    @Transform(({ obj }: { obj: FormData }) => obj.get('poster'), { toClassOnly: true })
    public readonly poster!: File;

    @Expose()
    @IsInt()
    @Min(0)
    @Max(100)
    @Transform(({ obj }: { obj: FormData }) => Number(obj.get('brightness')), { toClassOnly: true })
    public readonly brightness!: number;

    @Expose()
    @Transform(({ obj }: { obj: FormData }) => obj.get('logo'), { toClassOnly: true })
    public readonly logo!: File;

    @Expose()
    @IsNotEmpty()
    @MaxLength(16)
    @Transform(({ obj }: { obj: FormData }) => obj.get('title'), { toClassOnly: true })
    public readonly title!: string;

    @Expose()
    @IsNotEmpty()
    @MaxLength(64)
    @Transform(({ obj }: { obj: FormData }) => obj.get('subtitle'), { toClassOnly: true })
    public readonly subtitle!: string;

    @Expose()
    @Transform(({ obj }: { obj: FormData }) => Boolean(obj.get('SDK')), { toClassOnly: true })
    public readonly isSDK!: boolean;

    @Expose()
    @Transform(({ obj }: { obj: FormData }) => Boolean(obj.get('IC')), { toClassOnly: true })
    public readonly isIC!: boolean;

    @Expose()
    @Transform(({ obj }: { obj: FormData }) => Boolean(obj.get('SIP')), { toClassOnly: true })
    public readonly isSIP!: boolean;

    @Expose()
    @IsIn(['imperial', 'metric', 'standard', null])
    @Transform(({ obj }: { obj: FormData }) => obj.get('units'), { toClassOnly: true })
    public readonly units!: 'imperial' | 'metric' | 'standard' | null;

    @Expose()
    @IsInt()
    @Transform(({ obj }: { obj: FormData }) => Number(obj.get('cityId')), { toClassOnly: true })
    public readonly cityId!: number;

    @Expose()
    @IsInt()
    @Transform(({ obj }: { obj: FormData }) => Number(obj.get('extensionNumber')), { toClassOnly: true })
    public readonly extensionNumber!: number;

    @Expose()
    @Transform(({ obj }: { obj: FormData }) => obj.get('videoLink'), { toClassOnly: true })
    public readonly videoLink!: string;

    @Expose()
    @Transform(({ obj }: { obj: FormData }) => obj.get('sipTitle'), { toClassOnly: true })
    public readonly sipTitle!: string;

    @Expose()
    @IsInt()
    @Transform(({ obj }: { obj: FormData }) => Number(obj.get('extensionNumber1')), { toClassOnly: true })
    public readonly extensionNumber1!: number;

    @Expose()
    @Transform(({ obj }: { obj: FormData }) => obj.get('videoLink1'), { toClassOnly: true })
    public readonly videoLink1!: string;

    @Expose()
    @Transform(({ obj }: { obj: FormData }) => obj.get('sipTitle1'), { toClassOnly: true })
    public readonly sipTitle1!: string;

    @Expose()
    @IsInt()
    @Transform(({ obj }: { obj: FormData }) => Number(obj.get('extensionNumber2')), { toClassOnly: true })
    public readonly extensionNumber2!: number;

    @Expose()
    @Transform(({ obj }: { obj: FormData }) => obj.get('videoLink2'), { toClassOnly: true })
    public readonly videoLink2!: string;

    @Expose()
    @Transform(({ obj }: { obj: FormData }) => obj.get('sipTitle2'), { toClassOnly: true })
    public readonly sipTitle2!: string;

    @Expose()
    @IsInt()
    @Transform(({ obj }: { obj: FormData }) => Number(obj.get('extensionNumber3')), { toClassOnly: true })
    public readonly extensionNumber3!: number;

    @Expose()
    @Transform(({ obj }: { obj: FormData }) => obj.get('videoLink3'), { toClassOnly: true })
    public readonly videoLink3!: string;

    @Expose()
    @Transform(({ obj }: { obj: FormData }) => obj.get('sipTitle3'), { toClassOnly: true })
    public readonly sipTitle3!: string;

    @Expose()
    @Transform(({ obj }: { obj: FormData }) => Boolean(obj.get('displayFootnote')), { toClassOnly: true })
    public readonly displayFootnote!: boolean;
  }

  const formData = plainToInstance(RequestFormDataDTO, await requestEvent.request.formData(), classTransformOptions);
  const formDataValidationErrors = validateSync(formData, classValidationOptions);
  if (formDataValidationErrors.length > 0) {
    return { status: 422, body: { form: 'Invalid submission.' }, headers: { Location: '/demos/create' } };
  }

  if(formData.cityId) {
    const isCityIdValid = await jsonRequest(env.OPENWEATHERMAP_API_URL)
      .get('weather', { appid: env.OPENWEATHERMAP_API_KEY, id: formData.cityId })
      .then(() => true)
      .catch(() => false);
    if (isCityIdValid === false) {
      return { status: 422, body: { form: 'Invalid submission.' }, headers: { Location: '/demos/create' } };
    }
  }

  const db = requestEvent.locals.db;
  const session = requestEvent.locals.session;

  const demoId = formData.id;
  return demoId != null
    ? await db
        ?.findOneOrFail(
          Demo,
          { uuid: demoId, user: { uuid: session?.user?.uuid } },
          {
            fields: [
              'uuid',
              'name',
              'description',
              'backgroundBrightness',
              'backgroundPoster.bits',
              'backgroundPoster.name',
              'backgroundPoster.type',
              'backgroundPoster.lastModified',
              'brandTitle',
              'brandSubtitle',
              'brandLogo.bits',
              'brandLogo.name',
              'brandLogo.type',
              'brandLogo.lastModified',
              'weatherUnits',
              'weatherCityId',
              'isSDK',
              'isIC',
              'isSIP',
              'videoLink',
              'extensionNumber',
              'sipTitle',
              'videoLink1',
              'extensionNumber1',
              'sipTitle1',
              'videoLink2',
              'extensionNumber2',
              'sipTitle2',
              'videoLink3',
              'extensionNumber3',
              'sipTitle3',
              'displayFootnote'
            ],
            strategy: LoadStrategy.JOINED
          }
        )
        .then(async (r) => {
          r.name = formData.name;
          r.description = formData.description;
          r.backgroundBrightness = formData.brightness;
          r.backgroundPoster.bits = Buffer.from(await formData.poster.arrayBuffer());
          r.backgroundPoster.type = formData.poster.type;
          r.backgroundPoster.name = formData.poster.name;
          r.backgroundPoster.lastModified = formData.poster.lastModified;
          r.brandTitle = formData.title;
          r.brandSubtitle = formData.subtitle;
          r.brandLogo.bits = Buffer.from(await formData.logo.arrayBuffer());
          r.brandLogo.type = formData.logo.type;
          r.brandLogo.name = formData.logo.name;
          r.brandLogo.lastModified = formData.logo.lastModified;
          r.weatherUnits = formData.units;
          r.weatherCityId = formData.cityId;
          r.isSDK = formData.isSDK;
          r.isIC = formData.isIC;
          r.isSIP = formData.isSIP;
          r.videoLink = formData.videoLink;
          r.extensionNumber = formData.extensionNumber;
          r.sipTitle = formData.sipTitle;
          r.videoLink1 = formData.videoLink1;
          r.extensionNumber1 = formData.extensionNumber1;
          r.sipTitle1 = formData.sipTitle1;
          r.videoLink2 = formData.videoLink2;
          r.extensionNumber2 = formData.extensionNumber2;
          r.sipTitle2 = formData.sipTitle2;
          r.videoLink3 = formData.videoLink3;
          r.extensionNumber3 = formData.extensionNumber3;
          r.sipTitle3 = formData.sipTitle3;
          r.displayFootnote = formData.displayFootnote;

          await db.persistAndFlush(r);

          return { status: 302, headers: { Location: '/demos' } };
        })
        .catch(() => ({ status: 422 }))
    : { status: 422 };
};
