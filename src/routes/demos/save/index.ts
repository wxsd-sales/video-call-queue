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
              'extensionNumber1',
              'videoLink1',
              'sipTitle1',
              'sipImage1',
              'extensionNumber2',
              'videoLink2',
              'sipTitle2',
              'sipImage2',
              'extensionNumber3',
              'videoLink3',
              'sipTitle3',
              'sipImage3',
              'extensionNumber4',
              'videoLink4',
              'sipTitle4',
              'sipImage4',
              'displayFootnote'
            ],
            strategy: LoadStrategy.JOINED
          }
        )
        .then((r) => {
          return {
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
                  extensionNumber: r.extensionNumber1,
                  videoLink: r.videoLink1,
                  sipTitle: r.sipTitle1 || 'Looking for Assistance?',
                  sipImage: r.sipImage1
                    ? {
                        bits: 'data:' + r.sipImage1.type + ';base64,' + r.sipImage1.bits.toString('base64'),
                        name: r.sipImage1.name,
                        lastModified: r.sipImage1.lastModified,
                        type: r.sipImage1.type
                      }
                    : null
                },
                r?.extensionNumber2 && {
                  extensionNumber: r.extensionNumber2,
                  videoLink: r.videoLink2,
                  sipTitle: r.sipTitle2,
                  sipImage: r.sipImage2
                    ? {
                        bits: 'data:' + r.sipImage2.type + ';base64,' + r.sipImage2.bits.toString('base64'),
                        name: r.sipImage2.name,
                        lastModified: r.sipImage2.lastModified,
                        type: r.sipImage2.type
                      }
                    : null
                },
                r?.extensionNumber3 && {
                  extensionNumber: r.extensionNumber3,
                  videoLink: r.videoLink3,
                  sipTitle: r.sipTitle3,
                  sipImage: r.sipImage3
                    ? {
                        bits: 'data:' + r.sipImage3.type + ';base64,' + r.sipImage3.bits.toString('base64'),
                        name: r.sipImage3.name,
                        lastModified: r.sipImage3.lastModified,
                        type: r.sipImage3.type
                      }
                    : null
                },
                r.extensionNumber4 && {
                  extensionNumber: r.extensionNumber4,
                  videoLink: r.videoLink4,
                  sipTitle: r.sipTitle4,
                  sipImage: r.sipImage4
                    ? {
                        bits: 'data:' + r.sipImage4.type + ';base64,' + r.sipImage4.bits.toString('base64'),
                        name: r.sipImage4.name,
                        lastModified: r.sipImage4.lastModified,
                        type: r.sipImage4.type
                      }
                    : null
                }
              ].filter(Boolean),
              displayFootnote: Boolean(r.displayFootnote)
            }
          };
        })
        .catch({
          status: 200,
          body: { brightness: 55, title: 'Cisco', subtitle: 'Bridge to Possible', units: 'imperial', cityId: 4887398 }
        })
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
    @MaxLength(16)
    @Transform(({ obj }: { obj: FormData }) => obj.get('title'), { toClassOnly: true })
    public readonly title!: string;

    @Expose()
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
    @Transform(({ obj }: { obj: FormData }) => Number(obj.get('extensionNumber1')), { toClassOnly: true })
    public readonly extensionNumber1!: number;

    @Expose()
    @Transform(({ obj }: { obj: FormData }) => obj.get('videoLink1'), { toClassOnly: true })
    public readonly videoLink1!: string;

    @Expose()
    @Transform(({ obj }: { obj: FormData }) => obj.get('sipTitle1'), { toClassOnly: true })
    public readonly sipTitle1!: string;

    @Expose()
    @Transform(({ obj }: { obj: FormData }) => obj.get('sipImage1'), { toClassOnly: true })
    public readonly sipImage1!: File;

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
    @Transform(({ obj }: { obj: FormData }) => obj.get('sipImage2'), { toClassOnly: true })
    public readonly sipImage2!: File;

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
    @Transform(({ obj }: { obj: FormData }) => obj.get('sipImage3'), { toClassOnly: true })
    public readonly sipImage3!: File;

    @Expose()
    @IsInt()
    @Transform(({ obj }: { obj: FormData }) => Number(obj.get('extensionNumber4')), { toClassOnly: true })
    public readonly extensionNumber4!: number;

    @Expose()
    @Transform(({ obj }: { obj: FormData }) => obj.get('videoLink4'), { toClassOnly: true })
    public readonly videoLink4!: string;

    @Expose()
    @Transform(({ obj }: { obj: FormData }) => obj.get('sipTitle4'), { toClassOnly: true })
    public readonly sipTitle4!: string;

    @Expose()
    @Transform(({ obj }: { obj: FormData }) => obj.get('sipImage4'), { toClassOnly: true })
    public readonly sipImage4!: File;

    @Expose()
    @Transform(({ obj }: { obj: FormData }) => Boolean(obj.get('footnote')), { toClassOnly: true })
    public readonly displayFootnote!: boolean;
  }

  const formData = plainToInstance(RequestFormDataDTO, await requestEvent.request.formData(), classTransformOptions);
  const formDataValidationErrors = validateSync(formData, classValidationOptions);
  if (formDataValidationErrors.length > 0) {
    return { status: 422, body: { form: 'Invalid submission.' }, headers: { Location: '/demos/create' } };
  }

  if (formData.cityId) {
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
        videoLink1: formData.videoLink1,
        extensionNumber1: formData.extensionNumber1,
        sipTitle1: formData.sipTitle1,
        sipImage1: formData.sipImage1
          ? new Data({
              bits: Buffer.from(await formData.sipImage1.arrayBuffer()),
              type: formData.sipImage1.type,
              name: formData.sipImage1.name,
              lastModified: formData.sipImage1.lastModified
            })
          : null,
        videoLink2: formData.videoLink2,
        extensionNumber2: formData.extensionNumber2,
        sipTitle2: formData.sipTitle2,
        sipImage2: formData.sipImage2
          ? new Data({
              bits: Buffer.from(await formData.sipImage2.arrayBuffer()),
              type: formData.sipImage2.type,
              name: formData.sipImage2.name,
              lastModified: formData.sipImage2.lastModified
            })
          : null,
        videoLink3: formData.videoLink3,
        extensionNumber3: formData.extensionNumber3,
        sipTitle3: formData.sipTitle3,
        sipImage3: formData.sipImage3
          ? new Data({
              bits: Buffer.from(await formData.sipImage3.arrayBuffer()),
              type: formData.sipImage3.type,
              name: formData.sipImage3.name,
              lastModified: formData.sipImage3.lastModified
            })
          : null,
        videoLink4: formData.videoLink4,
        extensionNumber4: formData.extensionNumber4,
        sipTitle4: formData.sipTitle4,
        sipImage4: formData.sipImage4
          ? new Data({
              bits: Buffer.from(await formData.sipImage4.arrayBuffer()),
              type: formData.sipImage4.type,
              name: formData.sipImage4.name,
              lastModified: formData.sipImage4.lastModified
            })
          : null,
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
    @MaxLength(16)
    @Transform(({ obj }: { obj: FormData }) => obj.get('title'), { toClassOnly: true })
    public readonly title!: string;

    @Expose()
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
    @Transform(({ obj }: { obj: FormData }) => Number(obj.get('extensionNumber1')), { toClassOnly: true })
    public readonly extensionNumber1!: number;

    @Expose()
    @Transform(({ obj }: { obj: FormData }) => obj.get('videoLink1'), { toClassOnly: true })
    public readonly videoLink1!: string;

    @Expose()
    @Transform(({ obj }: { obj: FormData }) => obj.get('sipTitle1'), { toClassOnly: true })
    public readonly sipTitle1!: string;

    @Expose()
    @Transform(({ obj }: { obj: FormData }) => obj.get('sipImage1'), { toClassOnly: true })
    public readonly sipImage1!: File;

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
    @Transform(({ obj }: { obj: FormData }) => obj.get('sipImage2'), { toClassOnly: true })
    public readonly sipImage2!: File;

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
    @Transform(({ obj }: { obj: FormData }) => obj.get('sipImage3'), { toClassOnly: true })
    public readonly sipImage3!: File;

    @Expose()
    @IsInt()
    @Transform(({ obj }: { obj: FormData }) => Number(obj.get('extensionNumber4')), { toClassOnly: true })
    public readonly extensionNumber4!: number;

    @Expose()
    @Transform(({ obj }: { obj: FormData }) => obj.get('videoLink4'), { toClassOnly: true })
    public readonly videoLink4!: string;

    @Expose()
    @Transform(({ obj }: { obj: FormData }) => obj.get('sipTitle4'), { toClassOnly: true })
    public readonly sipTitle4!: string;

    @Expose()
    @Transform(({ obj }: { obj: FormData }) => obj.get('sipImage4'), { toClassOnly: true })
    public readonly sipImage4!: File;

    @Expose()
    @Transform(({ obj }: { obj: FormData }) => Boolean(obj.get('displayFootnote')), { toClassOnly: true })
    public readonly displayFootnote!: boolean;
  }

  const formData = plainToInstance(RequestFormDataDTO, await requestEvent.request.formData(), classTransformOptions);
  const formDataValidationErrors = validateSync(formData, classValidationOptions);
  if (formDataValidationErrors.length > 0) {
    return { status: 422, body: { form: 'Invalid submission.' }, headers: { Location: '/demos/create' } };
  }

  if (formData.cityId) {
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
          r.videoLink1 = formData.videoLink1;
          r.extensionNumber1 = formData.extensionNumber1;
          r.sipTitle1 = formData.sipTitle1;
          r.sipImage1 = formData.sipImage1
            ? new Data({
                bits: Buffer.from(await formData.sipImage1.arrayBuffer()),
                type: formData.sipImage1.type,
                name: formData.sipImage1.name,
                lastModified: formData.sipImage1.lastModified
              })
            : null;
          r.videoLink2 = formData.videoLink2;
          r.extensionNumber2 = formData.extensionNumber2;
          r.sipTitle2 = formData.sipTitle2;
          r.sipImage2 = formData.sipImage2
            ? new Data({
                bits: Buffer.from(await formData.sipImage2.arrayBuffer()),
                type: formData.sipImage2.type,
                name: formData.sipImage2.name,
                lastModified: formData.sipImage2.lastModified
              })
            : null;
          r.videoLink3 = formData.videoLink3;
          r.extensionNumber3 = formData.extensionNumber3;
          r.sipTitle3 = formData.sipTitle3;
          r.sipImage3 = formData.sipImage3
            ? new Data({
                bits: Buffer.from(await formData.sipImage3.arrayBuffer()),
                type: formData.sipImage3.type,
                name: formData.sipImage3.name,
                lastModified: formData.sipImage3.lastModified
              })
            : null;
          r.videoLink4 = formData.videoLink4;
          r.extensionNumber4 = formData.extensionNumber4;
          r.sipTitle4 = formData.sipTitle4;
          r.sipImage4 = formData.sipImage4
            ? new Data({
                bits: Buffer.from(await formData.sipImage4.arrayBuffer()),
                type: formData.sipImage4.type,
                name: formData.sipImage4.name,
                lastModified: formData.sipImage4.lastModified
              })
            : null;
          r.displayFootnote = formData.displayFootnote;

          await db.persistAndFlush(r);

          return { status: 302, headers: { Location: '/demos' } };
        })
        .catch((e) => {
          console.log(e);
        })
    : { status: 422 };
};
