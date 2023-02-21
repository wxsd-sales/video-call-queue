<script lang="ts">
  import { onMount } from 'svelte';
  import { io } from 'socket.io-client';
  import type { Socket } from 'socket.io-client';
  import { v4 as uuidv4 } from 'uuid';

  import { browser } from '$app/env';

  import { queueOrderStore, requesterIDStore } from '$lib/store';
  import * as CONST from './constants';

  import { BROWSER_VISIBILITY_STATUS, MEETING_TYPE_OPTIONS, SESSION_STATUS } from '$lib/enums';
  import { NOTIFICATION_TYPES } from '$components/Notification/enums';
  import type { RequestInfo } from '$lib/types';

  import Notification from '$components/Notification/Notification.svelte';

  export let socketID: string;
  export let isSDKAvailable: boolean;
  export let isICAvailable: boolean;
  export let isSIPAvailable: boolean;
  export let extensionNumber: number;

  let requestSubmitted = false;
  let readyToJoin: boolean = false;
  let displayIframe: boolean = false;
  let iframeIsLoading: boolean = false;
  let meetingInSession: boolean = false;
  let displaySIPErrorNotification = false;
  let displayICErrorNotification = false;
  let meetingURL: string = '';
  let incomingMeetingURL: string = '';
  let disableJoinButton = false;
  let disableSIPOption = false;

  let meetingType: MEETING_TYPE_OPTIONS =
    (isSDKAvailable && MEETING_TYPE_OPTIONS.BROWSER_SDK) ||
    (isICAvailable && MEETING_TYPE_OPTIONS.INSTANT_CONNECT) ||
    ((isSIPAvailable && MEETING_TYPE_OPTIONS.SIP_URI_DIALING) as MEETING_TYPE_OPTIONS);

  let displayMeetingOptions = isICAvailable && isSDKAvailable;
  let requestInfo: RequestInfo;

  const socketIO = io(import.meta.env.PUBLIC_SOAP_BOX_URL, { query: { room: socketID } });
  const isDevice = browser ? (window.navigator.userAgent.includes('RoomOS') ? true : false) : false;

  $requesterIDStore = $requesterIDStore ? $requesterIDStore : uuidv4();

  /**
   * Socket handler to listen and sort all events and pass them to the UI
   *
   * @param socket
   * @param requesterID
   * @param callback
   */
  const socketEventHandler = (
    socket: Socket,
    requesterID: string,
    callback: (event: string, payload?: unknown) => void
  ) => {
    socket.on(CONST.MESSAGE_RESPONSE, (payload) => {
      if (payload.index || payload.index === 0) {
        callback(CONST.SET_QUEUE_POSITION, { queuePosition: payload.index });
      }

      if (payload.id === CONST.INIT_LIST && payload.data) {
        callback(CONST.LIST_QUEUE, { queue: payload.data });
      }
    });

    socket.on(CONST.MESSAGE, (payload) => {
      if (payload.command === CONST.REMOVE) {
        if (payload.data?.id === requesterID) {
          callback(CONST.CANCEL_REQUEST);
        } else {
          if (requesterID != payload.key) {
            callback(CONST.UPDATE_QUEUE_POSITION, { queuePosition: payload.index });
          }
        }
      }

      if (payload.room === requesterID) {
        if (payload.data.event === CONST.SDK_MEETING_JOIN) {
          callback(CONST.SDK_JOIN_SESSION, { meetingUrl: payload.data.payload });
        }

        if (payload.data.event === CONST.MEMBERS_UPDATE) {
          if (
            payload.data.payload.updated.some((participant: any) => participant.isSelf && !participant.isInMeeting) ||
            payload.data.payload.updated.some(
              (participant: any) => participant.isHost && participant.status === 'NOT_IN_MEETING'
            )
          ) {
            callback(CONST.SDK_LEAVE_SESSION);
          }
        }
      }

      if (payload.set === CONST.IC_SESSION && payload.id === CONST.SET && requesterID === payload.key) {
        callback(CONST.IC_JOIN_SESSION, { meetingUrl: payload.data.link });
      }

      if (payload.set === CONST.IC_SESSION && payload.id === CONST.REMOVE && requesterID === payload.key) {
        callback(CONST.IC_LEAVE_SESSION);
      }

      if (payload.command === CONST.HSET && requesterID === payload.data.requesterID) {
        callback(CONST.UPDATE_REQUEST, { data: payload.data });
      }
    });
  };

  socketEventHandler(socketIO, $requesterIDStore, (event, payload = {}) => {
    switch (event) {
      case CONST.SDK_JOIN_SESSION:
        readyToJoin = true;
        incomingMeetingURL = `${payload.meetingUrl}&autoDial=true&embedSize=desktop&sessionId=${$requesterIDStore}`;
        requestSubmitted = false;
        break;

      case CONST.SDK_LEAVE_SESSION:
        meetingURL = '';
        displayIframe = false;
        readyToJoin = false;
        iframeIsLoading = false;
        cancelRequest();
        break;

      case CONST.IC_JOIN_SESSION:
        readyToJoin = true;
        incomingMeetingURL = payload.meetingUrl;
        requestSubmitted = false;
        break;

      case CONST.IC_LEAVE_SESSION:
        displayIframe = false;
        readyToJoin = false;
        iframeIsLoading = false;
        cancelRequest();
        break;

      case CONST.SET_QUEUE_POSITION:
        $queueOrderStore = payload.queuePosition;
        break;

      case CONST.UPDATE_QUEUE_POSITION:
        if (payload.queuePosition < $queueOrderStore) {
          $queueOrderStore -= 1;
        }
        break;

      case CONST.CANCEL_REQUEST:
        requestSubmitted = false;
        displayIframe = false;
        readyToJoin = false;
        break;

      case CONST.LIST_QUEUE:
        requestSubmitted = payload.queue.some((q) => q.value === $requesterIDStore);

        break;

      case CONST.UPDATE_REQUEST:
        requestInfo = payload.data;
        break;
    }
  });

  /**
   * Updates the queue request visibility status if the status changes.
   *
   * @param visibilityStatus
   */
  const sendBrowserVisibilityStatus = (visibilityStatus: BROWSER_VISIBILITY_STATUS) => {
    // Update visibility only if the meeting is NOT in session
    if (requestSubmitted) {
      socketIO.emit(CONST.MESSAGE, {
        data: { ...requestInfo, visibilityStatus },
        key: $requesterIDStore,
        set: CONST.QUEUE,
        command: CONST.HSET
      });
    }
  };

  /** Cancels the request and removes it from the queue */
  const cancelRequest = () => {
    socketIO.emit(CONST.MESSAGE, {
      command: CONST.REMOVE,
      set: CONST.QUEUE,
      data: requestInfo,
      key: $requesterIDStore,
      id: CONST.REMOVE
    });

    requestSubmitted = false;
  };

  /** Submits a request and append it to the queue */
  const submitRequest = () => {
    if (meetingType === MEETING_TYPE_OPTIONS.SIP_URI_DIALING) {
      location.href = `sip:${extensionNumber}`;
      return;
    }

    requestInfo = {
      id: $requesterIDStore,
      visibilityStatus: BROWSER_VISIBILITY_STATUS.ACTIVE,
      meetingType,
      sessionStatus: SESSION_STATUS.INACTIVE
    };

    const message = {
      command: CONST.APPEND,
      set: CONST.QUEUE,
      key: $requesterIDStore,
      id: CONST.APPEND,
      data: requestInfo
    };

    socketIO.emit(CONST.MESSAGE, message);
    requestSubmitted = true;
  };

  /**
   * Joins the sessions with the given url
   *
   * @param url
   */
  const joinSession = (url: string) => {
    displayIframe = true;

    meetingURL = url;
  };

  onMount(() => {
    socketIO.on(CONST.CONNECT, () => {
      const message = { command: CONST.LIST, set: CONST.QUEUE, id: CONST.INIT_LIST, key: CONST.LIST };
      socketIO.emit(CONST.MESSAGE, message);
      socketIO.emit(CONST.JOIN, $requesterIDStore);
    });

    if (browser) {
      // Register a listener to trigger an event if the content of the tab has become visible or hidden
      window.addEventListener(CONST.VISIBILITY_CHANGE, () =>
        sendBrowserVisibilityStatus(
          document.visibilityState === CONST.VISIBILITY_HIDDEN
            ? BROWSER_VISIBILITY_STATUS.INACTIVE
            : BROWSER_VISIBILITY_STATUS.ACTIVE
        )
      );
    }

    if (!isDevice && isSIPAvailable) {
      displaySIPErrorNotification = true;
      disableJoinButton = true;
      disableSIPOption = true;
    }

    if (isDevice && isICAvailable) displayICErrorNotification = true;

    return () => {
      socketIO.disconnect();
    };
  });
</script>

<div class="columns mb-2 is-align-items-center is-mobile">
  <div class="column auto">
    <h1 class="is-size-3  has-text-white">Requester View</h1>
  </div>
  <div class="column is-3 is-flex is-justify-content-flex-end" />
</div>
<hr class="mt-3" />
<div class="is-flex is-justify-content-center is-align-items-center is-fullheight ">
  <span class="bulma-loader-mixin" class:is-hidden={!iframeIsLoading} style="position:absolute" />
  <iframe
    width="100%"
    height="100%"
    title="meeting"
    src={meetingURL}
    class:is-hidden={!displayIframe && !meetingInSession}
    allow="camera;microphone; fullscreen;display-capture"
    on:load={() => {
      iframeIsLoading = false;
    }}
  />
  {#if meetingInSession}
    <div class="flash box is-flex is-flex-direction-column is-translucent-black pb-5" style="padding: 2rem;">
      <div class=" title has-text-white is-size-5 mb-4">Meeting In Session!</div>
    </div>
  {/if}
  {#if !displayIframe}
    <div class="box is-flex is-flex-direction-column is-translucent-black pb-5" style="padding: 2.5rem;">
      {#if readyToJoin}
        <div class="has-text-centered has-text-white is-size-5 mb-4">Representative is Now Available!</div>
        <button class="button is-size-5 mt-6 is-primary is-centered" on:click={() => joinSession(incomingMeetingURL)}
          >Join Support Session
        </button>
      {:else if requestSubmitted}
        <div class="is-size-5 has-text-white has-text-centered">
          Your request has been queued. A representative will reach out shortly.
        </div>
        <span class="has-text-white has-text-centered flash" style="margin-top: 1.5rem; font-size: 0.9rem;">
          {$queueOrderStore === 0 ? 'You are next!' : `There are ${$queueOrderStore} additional requests ahead of you.`}
        </span>
        <button class="button is-size-5 mt-6 is-danger is-centered" on:click={cancelRequest}>Cancel Request </button>
      {:else}
        <div class="title has-text-white  has-text-centered is-size-4">Looking for Assistance?</div>
        <button
          class="button is-size-5 is-primary is-centered mb-5"
          style="margin-top: 1.75rem;"
          disabled={disableJoinButton && isSIPAvailable && !isICAvailable && !isSDKAvailable}
          on:click={submitRequest}
          >Request Assistance
        </button>
        <div
          class="control is-justify-content-space-around is-flex has-text-white is-size-6"
          style="margin: 1rem 0 0.25rem 0;"
        >
          {#if displayMeetingOptions}
            {#if isSDKAvailable}
              <label class="radio">
                <input
                  type="radio"
                  name="meeting"
                  value={MEETING_TYPE_OPTIONS.BROWSER_SDK}
                  checked={meetingType === MEETING_TYPE_OPTIONS.BROWSER_SDK}
                  on:change={(e) => (meetingType = MEETING_TYPE_OPTIONS.BROWSER_SDK)}
                />
                <span class="is-hidden-mobile"> Meeting </span>
                <span>SDK</span>
              </label>
            {/if}
            {#if isICAvailable}
              <label id="ic-checkbox" class="radio ml-4">
                <input
                  type="radio"
                  name="meeting"
                  disabled={isDevice}
                  checked={meetingType === MEETING_TYPE_OPTIONS.INSTANT_CONNECT}
                  value={MEETING_TYPE_OPTIONS.INSTANT_CONNECT}
                  on:change={(e) => (meetingType = MEETING_TYPE_OPTIONS.INSTANT_CONNECT)}
                />
                {#if isDevice}
                  <s class="has-text-grey">
                    <span class="is-hidden-mobile">Instant Connect</span>
                    <span class="is-hidden-tablet">IC</span>
                  </s>
                {:else}
                  <span class="is-hidden-mobile">Instant Connect</span>
                  <span class="is-hidden-tablet">IC</span>
                {/if}
              </label>
            {/if}
            {#if isSIPAvailable}
              <label id="sip-checkbox" class="radio ml-4">
                <input
                  type="radio"
                  name="meeting"
                  disabled={disableSIPOption}
                  checked={meetingType === MEETING_TYPE_OPTIONS.SIP_URI_DIALING}
                  value={MEETING_TYPE_OPTIONS.SIP_URI_DIALING}
                  on:change={(e) => (meetingType = MEETING_TYPE_OPTIONS.SIP_URI_DIALING)}
                />
                {#if disableSIPOption}
                  <s class="has-text-grey">
                    <span>SIP</span>
                    <span class="is-hidden-mobile "> URI Dialing </span>
                  </s>
                {:else}
                  <span>SIP</span>
                  <span class="is-hidden-mobile "> URI Dialing </span>
                {/if}
              </label>
            {/if}
          {/if}
        </div>
        <div class="has-text-white has-text-centered mt-5" style="font-size: 0.65rem ">
          * Unanswered request will auto-expire in 30 minutes
        </div>
      {/if}
    </div>
  {/if}
</div>

<Notification type={NOTIFICATION_TYPES.ERROR} display={displaySIPErrorNotification}>
  In order to experience our <strong>SIP URI Dialing</strong> flow, you must launch this demo on Cisco roomOS devices in
  kiosk mode with proper macro setup enabled on the device and enable WxC video calling queue. For more information
  please visit our
  <a
    target="_blank"
    href="https://cisco.sharepoint.com/sites/WXSD-WebexSolutionsDevelopment/Shared%20Documents/Forms/AllItems.aspx?id=%2Fsites%2FWXSD%2DWebexSolutionsDevelopment%2FShared%20Documents%2FDemos%2FVideo%20Device%20Kisosk%20on%20WxC%2FOld%20version%2FCisco%20Device%20Kiosk%20using%20Macros%20%26%20Webex%20Calling%20Group%20Call%20Management%2Epdf&parent=%2Fsites%2FWXSD%2DWebexSolutionsDevelopment%2FShared%20Documents%2FDemos%2FVideo%20Device%20Kisosk%20on%20WxC%2FOld%20version&p=true&ga=1"
    >page</a
  >.
</Notification>

<Notification type={NOTIFICATION_TYPES.ERROR} display={displayICErrorNotification}>
  Instant Connect feature is not currently available on Cisco roomOS device in kiosk mode.
</Notification>
