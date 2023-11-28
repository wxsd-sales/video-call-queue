import type { WEATHER_RESPONSE_UNITS } from '$lib/enums';

export interface TokenResponse {
  id?: string;
  scope: string;
  expiresIn: number;
  expiresAt: string;
  accessToken: string;
  tokenType: string;
  refreshToken: string;
  refreshTokenExpiresIn: number;
  refreshTokenExpiresAt: string;
}

export interface AuthorizeResponse {
  deviceCode: string;
  expiresIn: number;
  expiresAt: string;
  userCode: string;
  verificationUri: string;
  verificationUriComplete: string;
  interval: number;
  qrImage: string;
}

export interface WeatherResponse {
  units: WEATHER_RESPONSE_UNITS;
  place: string;
  timezone: number;
  temp: number;
  tempMin: number;
  tempMax: number;
  main: string;
  description: string;
  icon: string;
  svg: string;
}

export interface MindyResponse {
  redirect: string;
}

export interface ICResponse {
  host: [{ cipher: string }];
  guest: [{ cipher: string }];
}

export interface ICToken {
  token: string;
}
