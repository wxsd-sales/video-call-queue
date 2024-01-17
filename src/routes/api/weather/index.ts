import 'reflect-metadata';
import type { RequestEvent, RequestHandler } from '@sveltejs/kit';
import type { JSONValue, ToJSON } from '@sveltejs/kit/types/private';
import { Expose, instanceToPlain, plainToInstance, Transform } from 'class-transformer';
import env from '$lib/environment';

export const GET: RequestHandler = async (requestEvent: RequestEvent) => {
  try {
    class ResponseDTO implements ToJSON {
      @Expose()
      public readonly units!: 'imperial' | 'metric' | 'standard';

      @Expose()
      @Transform(({ obj }) => `${obj.name}, ${obj.sys.country}`, { toClassOnly: true })
      public readonly place!: string;

      @Expose()
      public readonly timezone!: number;

      @Expose()
      @Transform(({ obj }) => obj.main.temp, { toClassOnly: true })
      public readonly temp!: number;

      @Expose()
      @Transform(({ obj }) => obj.main.tempMin ?? obj.main.temp_min, { toClassOnly: true })
      public readonly tempMin!: number;

      @Expose()
      @Transform(({ obj }) => obj.main.tempMax ?? obj.main.temp_max, { toClassOnly: true })
      public readonly tempMax!: number;

      @Expose()
      @Transform(({ obj }) => obj.weather[0].main, { toClassOnly: true })
      public readonly main!: string;

      @Expose()
      @Transform(({ obj }) => obj.weather[0].description, { toClassOnly: true })
      public readonly description!: string;

      @Expose()
      @Transform(({ obj }) => obj.weather[0].icon, { toClassOnly: true })
      public readonly icon!: string;

      toJSON(): Exclude<JSONValue, ToJSON> {
        return instanceToPlain(this);
      }
    }

    requestEvent.url.searchParams.append('appid', env.OPENWEATHERMAP_API_KEY);

    const response = await (
      await fetch(`${env.OPENWEATHERMAP_API_URL}/weather?` + requestEvent.url.searchParams)
    ).json();

    return {
      status: 200,
      body: plainToInstance(ResponseDTO, { units: requestEvent.url.searchParams.get('units'), ...response }),
      headers: {
        'Cache-Control': 'public, max-age=600',
        'Expires': new Date(Date.now() + 10 * 60 * 1000).toUTCString()
      }
    };
  } catch (e) {
    console.log(e);
  }
};
