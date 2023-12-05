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
import { Data, Demo } from '../../database/entities';
import { jsonRequest } from '$lib/shared/json-request';
import { classTransformOptions, classValidationOptions } from '../.utils';
import env from '$lib/environment';
import { LoadStrategy } from '@mikro-orm/core';

const toFile = ({ bits, name, lastModified, type }: Data) => ({
  bits: 'data:' + type + ';base64,' + bits.toString('base64'),
  name,
  lastModified,
  type: type
});

const toData = async (file: File) =>
  new Data({
    bits: Buffer.from(await file.arrayBuffer()),
    type: file.type,
    name: file.name,
    lastModified: file.lastModified
  });

const createSIPObject = (sipTitle: string, extensionNumber: number, videoLink: string, sipImage: Data) =>
  extensionNumber &&
  videoLink &&
  sipTitle && {
    extensionNumber,
    videoLink,
    sipTitle,
    sipImage: sipImage ? toFile(sipImage) : null
  };

const generateSIPQueues = (response) => {
  const qs = [];
  const MAX_QUEUES = 4;

  for (let i = 1; i <= MAX_QUEUES; i++) {
    qs.push(
      createSIPObject(
        response[`sipTitle${i}`],
        response[`extensionNumber${i}`],
        response[`videoLink${i}`],
        response[`sipImage${i}`]
      )
    );
  }
  return qs.filter(Boolean);
};

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
  'displayFootnote'
];

/** @typedef {import('class-validator').ValidationError} ValidationError */
export const GET = async (requestEvent: RequestEvent) => {
  const demoId = requestEvent.params.uuid;
  const db = requestEvent.locals.db;
  const session = requestEvent.locals.session;

  return demoId != null
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
          const qs = generateSIPQueues(r);
          return {
            status: 200,
            body: {
              name: r.name,
              poster: toFile(r.backgroundPoster),
              brightness: r.backgroundBrightness,
              logo: toFile(r.brandLogo),
              cityId: r.weatherCityId,
              units: r.weatherUnits,
              SIPQueues: qs,
              displayFootnote: Boolean(r.displayFootnote)
            }
          };
        })
        .catch({
          status: 200,
          body: { brightness: 55, units: 'imperial', cityId: 4887398 }
        })
    : {
        status: 200,
        body: {
          brightness: 55,
          units: 'imperial',
          cityId: 4887398,
          SIPQueues: [
            {
              extensionNumber: 1111,
              videoLink: 'https://wxsd-sales.github.io/video-queue-macro/example-content',
              sipTitle: 'Looking For Assistance?',
              sipImage: null
            }
          ]
        }
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
        backgroundPoster: await toData(formData.poster),
        backgroundBrightness: formData.brightness,
        brandLogo: await toData(formData.logo),
        weatherUnits: formData.units,
        weatherCityId: formData.cityId,
        videoLink1: formData.videoLink1,
        extensionNumber1: formData.extensionNumber1,
        sipTitle1: formData.sipTitle1,
        sipImage1: formData.sipImage1 ? await toData(formData.sipImage1) : null,
        videoLink2: formData.videoLink2,
        extensionNumber2: formData.extensionNumber2,
        sipTitle2: formData.sipTitle2,
        sipImage2: formData.sipImage2 ? await toData(formData.sipImage2) : null,
        videoLink3: formData.videoLink3,
        extensionNumber3: formData.extensionNumber3,
        sipTitle3: formData.sipTitle3,
        sipImage3: formData.sipImage3 ? await toData(formData.sipImage3) : null,
        videoLink4: formData.videoLink4,
        extensionNumber4: formData.extensionNumber4,
        sipTitle4: formData.sipTitle4,
        sipImage4: formData.sipImage4 ? await toData(formData.sipImage4) : null,
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
    @Transform(() => requestEvent.params.uuid, { toClassOnly: true })
    public readonly id!: string;

    @Expose()
    @IsNotEmpty()
    @MinLength(6)
    @MaxLength(64)
    @Transform(({ obj }: { obj: FormData }) => obj.get('name'), { toClassOnly: true })
    public readonly name!: string;

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
    console.log(formDataValidationErrors);
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
            fields,
            strategy: LoadStrategy.JOINED
          }
        )
        .then(async (r) => {
          r.name = formData.name;
          r.backgroundBrightness = formData.brightness;
          r.backgroundPoster.bits = Buffer.from(await formData.poster.arrayBuffer());
          r.backgroundPoster.type = formData.poster.type;
          r.backgroundPoster.name = formData.poster.name;
          r.backgroundPoster.lastModified = formData.poster.lastModified;
          r.brandLogo.bits = Buffer.from(await formData.logo.arrayBuffer());
          r.brandLogo.type = formData.logo.type;
          r.brandLogo.name = formData.logo.name;
          r.brandLogo.lastModified = formData.logo.lastModified;
          r.weatherUnits = formData.units;
          r.weatherCityId = formData.cityId;
          r.videoLink1 = formData.videoLink1;
          r.extensionNumber1 = formData.extensionNumber1;
          r.sipTitle1 = formData.sipTitle1;
          r.sipImage1 = formData.sipImage1 ? await toData(formData.sipImage1) : null;
          r.videoLink2 = formData.videoLink2;
          r.extensionNumber2 = formData.extensionNumber2;
          r.sipTitle2 = formData.sipTitle2;
          r.sipImage2 = formData.sipImage2 ? await toData(formData.sipImage2) : null;
          r.videoLink3 = formData.videoLink3;
          r.extensionNumber3 = formData.extensionNumber3;
          r.sipTitle3 = formData.sipTitle3;
          r.sipImage3 = formData.sipImage3 ? await toData(formData.sipImage3) : null;
          r.videoLink4 = formData.videoLink4;
          r.extensionNumber4 = formData.extensionNumber4;
          r.sipTitle4 = formData.sipTitle4;
          r.sipImage4 = formData.sipImage4 ? await toData(formData.sipImage4) : null;
          r.displayFootnote = formData.displayFootnote;

          await db.persistAndFlush(r);

          return { status: 302, headers: { Location: '/demos' } };
        })
        .catch((e) => {
          console.log(e);
        })
    : { status: 422 };
};

export const DELETE = async (requestEvent: RequestEvent) => {
  const demoId = requestEvent.params.uuid;
  const db = requestEvent.locals.db;
  const session = requestEvent.locals.session;

  if (db && session && session.user && session.user.uuid) {
    await db.findOne(Demo, demoId).then((r) => (r && r.user.uuid === session.user?.uuid ? db.removeAndFlush(r) : null));

    return { status: 302, headers: { Location: '/demos' } };
  }

  return { status: 422 };
};
