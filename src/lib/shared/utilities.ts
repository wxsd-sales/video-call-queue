const toFile = ({ bits, name, lastModified, type }: Data) => ({
  bits: 'data:' + type + ';base64,' + bits.toString('base64'),
  name,
  lastModified,
  type: type
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
    backgroundPoster: toFile(response.backgroundPoster),
    backgroundBrightness: response.backgroundBrightness,
    brandLogo: toFile(response.brandLogo),
    weatherCityId: response.weatherCityId,
    weatherUnits: response.weatherUnits,
    SIPQueues: generateSIPQueues(response),
    displayFootnote: Boolean(response.displayFootnote),
    displayWeather: Boolean(response.displayWeather)
  };
};
