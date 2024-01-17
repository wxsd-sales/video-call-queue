export const WEBEX_API_ENDPOINT = 'https://webexapis.com/v1';

export const WEBEX_SDK_CONFIG = {
  logger: { level: 'silent' },
  meetings: { reconnection: { enabled: true } }
};
export const VALID_DOMAINS = ['http://call-queue.wbx.ninja', 'https://call-queue.wbx.ninja', 'http://localhost:5173'];
export const CONTROL_HUB_URL = 'https://admin.webex.com';
export const DEVICE_CALL_QUEUE_VIDCAST = 'https://app.vidcast.io/share/05285d39-75a7-429e-81d0-61911a931973';
export const DEVICE_CALL_QUEUE_SETUP_GUIDE =
  'https://cisco.sharepoint.com/:b:/s/WXSD-WebexSolutionsDevelopment/EQJu96KU411LpGw16KdT4ewBwZsAOl7NEH_Tnprt6UX4tA';
export const VALID_ACCESS_TOKEN =
  /^([a-zA-Z0-9]{64})_(.*)_([0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12})$/;

export const DEFAULT_SIP_CONFIG = {
  extensionNumber: 1111,
  videoLink: 'https://wxsd-sales.github.io/video-queue-macro/example-content',
  sipTitle: 'Looking For Assistance?',
  sipImage: {
    bits: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZD0iTTE4LjcyLDE0Ljc2QzE5LjA3LDEzLjkxIDE5LjI2LDEzIDE5LjI2LDEyQzE5LjI2LDExLjI4IDE5LjE1LDEwLjU5IDE4Ljk2LDkuOTVDMTguMzEsMTAuMSAxNy42MywxMC4xOCAxNi45MiwxMC4xOEMxMy44NiwxMC4xOCAxMS4xNSw4LjY3IDkuNSw2LjM0QzguNjEsOC41IDYuOTEsMTAuMjYgNC43NywxMS4yMkM0LjczLDExLjQ3IDQuNzMsMTEuNzQgNC43MywxMkE3LjI3LDcuMjcgMCAwLDAgMTIsMTkuMjdDMTMuMDUsMTkuMjcgMTQuMDYsMTkuMDQgMTQuOTcsMTguNjNDMTUuNTQsMTkuNzIgMTUuOCwyMC4yNiAxNS43OCwyMC4yNkMxNC4xNCwyMC44MSAxMi44NywyMS4wOCAxMiwyMS4wOEM5LjU4LDIxLjA4IDcuMjcsMjAuMTMgNS41NywxOC40MkM0LjUzLDE3LjM4IDMuNzYsMTYuMTEgMy4zMywxNC43M0gyVjEwLjE4SDMuMDlDMy45Myw2LjA0IDcuNiwyLjkyIDEyLDIuOTJDMTQuNCwyLjkyIDE2LjcxLDMuODcgMTguNDIsNS41OEMxOS42OSw2Ljg0IDIwLjU0LDguNDUgMjAuODksMTAuMThIMjJWMTQuNjdIMjJWMTQuNjlMMjIsMTQuNzNIMjEuOTRMMTguMzgsMThMMTMuMDgsMTcuNFYxNS43M0gxNy45MUwxOC43MiwxNC43Nk05LjI3LDExLjc3QzkuNTcsMTEuNzcgOS44NiwxMS44OSAxMC4wNywxMi4xMUMxMC4yOCwxMi4zMiAxMC40LDEyLjYxIDEwLjQsMTIuOTFDMTAuNCwxMy4yMSAxMC4yOCwxMy41IDEwLjA3LDEzLjcxQzkuODYsMTMuOTIgOS41NywxNC4wNCA5LjI3LDE0LjA0QzguNjQsMTQuMDQgOC4xMywxMy41NCA4LjEzLDEyLjkxQzguMTMsMTIuMjggOC42NCwxMS43NyA5LjI3LDExLjc3TTE0LjcyLDExLjc3QzE1LjM1LDExLjc3IDE1Ljg1LDEyLjI4IDE1Ljg1LDEyLjkxQzE1Ljg1LDEzLjU0IDE1LjM1LDE0LjA0IDE0LjcyLDE0LjA0QzE0LjA5LDE0LjA0IDEzLjU4LDEzLjU0IDEzLjU4LDEyLjkxQTEuMTQsMS4xNCAwIDAsMSAxNC43MiwxMS43N1oiIGZpbGw9IiNmZmZmZmYiLz48L3N2Zz4=',
    name: 'customer-support.svg',
    lastModified: 1702320939243,
    type: 'image/svg+xml'
  }
};
