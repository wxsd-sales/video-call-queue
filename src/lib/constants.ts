export const WEBEX_API_ENDPOINT = 'https://webexapis.com/v1';

export const WEBEX_SDK_CONFIG = {
  logger: { level: 'silent' },
  meetings: { reconnection: { enabled: true } }
};

export const CONTROL_HUB_URL =  'https://admin.webex.com';
export const DEVICE_CALL_QUEUE_VIDCAST =  'https://app.vidcast.io/share/05285d39-75a7-429e-81d0-61911a931973';
export const DEVICE_CALL_QUEUE_SETUP_GUIDE = 'https://cisco.sharepoint.com/sites/WXSD-WebexSolutionsDevelopment/Shared%20Documents/Forms/AllItems.aspx?id=%2Fsites%2FWXSD%2DWebexSolutionsDevelopment%2FShared%20Documents%2FDemos%2FVideo%20Device%20Kisosk%20on%20WxC%2FOld%20version%2FCisco%20Device%20Kiosk%20using%20Macros%20%26%20Webex%20Calling%20Group%20Call%20Management%2Epdf&parent=%2Fsites%2FWXSD%2DWebexSolutionsDevelopment%2FShared%20Documents%2FDemos%2FVideo%20Device%20Kisosk%20on%20WxC%2FOld%20version&p=true&ga=1';
export const VALID_ACCESS_TOKEN =
  /^([a-zA-Z0-9]{64})_(.*)_([0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12})$/;
