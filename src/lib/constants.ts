export const WEBEX_API_ENDPOINT = 'https://webexapis.com/v1';

export const WEBEX_SDK_CONFIG = {
  logger: { level: 'silent' },
  meetings: { reconnection: { enabled: true } }
};

export const CONTROL_HUB_URL = 'https://admin.webex.com';
export const DEVICE_CALL_QUEUE_VIDCAST = 'https://app.vidcast.io/share/05285d39-75a7-429e-81d0-61911a931973';
export const DEVICE_CALL_QUEUE_SETUP_GUIDE =
  'https://cisco.sharepoint.com/:b:/s/WXSD-WebexSolutionsDevelopment/EQJu96KU411LpGw16KdT4ewBwZsAOl7NEH_Tnprt6UX4tA';
export const VALID_ACCESS_TOKEN =
  /^([a-zA-Z0-9]{64})_(.*)_([0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12})$/;
