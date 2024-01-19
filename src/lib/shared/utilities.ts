import { DEFAULT_SIP_CONFIG } from '$lib/constants';

export const createImageObj = ({ bits, name, lastModified, type }: Data) => ({
  bits: 'data:' + type + ';base64,' + bits.toString('base64'),
  name,
  lastModified,
  type
});

const createSIPObject = (sipTitle: string, extensionNumber: number, videoLink: string, sipImage: Data) =>
  extensionNumber &&
  videoLink &&
  sipTitle && {
    extensionNumber,
    videoLink,
    sipTitle,
    sipImage: sipImage ? createImageObj(sipImage) : DEFAULT_SIP_CONFIG.sipImage
  };

const generateSIPQueues = (response: any) => {
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

export const generateDemo = (response: any) => {
  return {
    name: response.name,
    backgroundPoster: createImageObj(response.backgroundPoster),
    backgroundBrightness: response.backgroundBrightness,
    brandLogo: createImageObj(response.brandLogo),
    weatherCityId: response.weatherCityId,
    weatherUnits: response.weatherUnits || 'imperial',
    SIPQueues: generateSIPQueues(response),
    displayFootnote: Boolean(response.displayFootnote),
    displayWeather: Boolean(response.displayWeather)
  };
};
