import type {
  MEETING_TYPE_OPTIONS,
  SESSION_STATUS,
  BROWSER_VISIBILITY_STATUS,
  WEATHER_RESPONSE_UNITS
} from '$lib/enums';

export type RequestInfo = {
  id: string;
  sessionStatus: SESSION_STATUS;
  timeStamp?: Date;
  meetingType: MEETING_TYPE_OPTIONS;
  visibilityStatus: BROWSER_VISIBILITY_STATUS;
};

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
  guest: [guestData: string];
  host: [hostData: string];
}

export interface ICToken {
  token: string;
}
