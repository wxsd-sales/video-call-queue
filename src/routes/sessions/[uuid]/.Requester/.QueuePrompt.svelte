<script type="ts">
  import { browser } from '$app/env';
  import { queueOrderStore, requesterIDStore, hideSIPWarningStore } from '$lib/store';
  import { onMount } from 'svelte';
  import { createEventDispatcher } from 'svelte';

  import { io } from 'socket.io-client';
  import { v4 as uuidv4 } from 'uuid';

  import { socketEventHandler } from './EventHandler';

  import * as CONST from '../constants';

  import { NOTIFICATION_VALUES } from '$components/Notification/enums';

  import { BROWSER_VISIBILITY_STATUS, MEETING_TYPE_OPTIONS, SESSION_STATUS } from '$lib/enums';

  import type { RequestInfo } from '$lib/types';

  export let isSDK: boolean;
  export let isIC: boolean;
  export let isSIP: boolean;
  export let extensionNumber: number;
  export let title: string;
  export let sipImage: string;
  export let embeddable: boolean;
  export let uuid;
  export let index;

  let iframeIsLoading: boolean = false;
  let displayIframe: boolean = false;
  let meetingInSession: boolean = false;
  let readyToJoin: boolean = false;
  let requestSubmitted = false;
  let disableJoinButton = false;
  let requestInfo: RequestInfo;

  let disableSIPOption = false;
  let isLoading = false;
  let SIPrequestIsSubmitted = false;

  // Meeting URL
  let incomingMeetingURL: string = '';
  let meetingURL: string = '';

  // Event
  const dispatch = createEventDispatcher();

  let meetingType: MEETING_TYPE_OPTIONS =
    (isSDK && MEETING_TYPE_OPTIONS.BROWSER_SDK) ||
    (isIC && MEETING_TYPE_OPTIONS.INSTANT_CONNECT) ||
    ((isSIP && MEETING_TYPE_OPTIONS.SIP_URI_DIALING) as MEETING_TYPE_OPTIONS);

  let displayMeetingOptions = isSDK ? isIC || isSIP : isIC && isSIP;
  const socketIO = io(import.meta.env.PUBLIC_SOAP_BOX_URL, { query: { room: uuid } });
  const isDevice = browser ? (window.navigator.userAgent.includes('RoomOS') ? true : false) : false;
  $requesterIDStore = $requesterIDStore ? $requesterIDStore : uuidv4();

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

  const displayNotification = (props) => {
    dispatch('notif', {
      props
    });
  };

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
      const isInIframe = window.self !== window.top;
      SIPrequestIsSubmitted = true;
      window.location.hash = String(extensionNumber);
      window.location.hash = '';

      if (isInIframe) {
        isLoading = true;
        location.href = `sip:${extensionNumber}`;

        setTimeout(() => {
          isLoading = false;
        }, 2000);
      } else {
        isLoading = true;
        if (!$hideSIPWarningStore) {
          displayNotification({ type: NOTIFICATION_VALUES.NEW_SIP_ERROR, extensionNumber: extensionNumber });
          $hideSIPWarningStore = true;
        }
        setTimeout(() => {
          isLoading = false;
        }, 1000);
      }

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
    $hideSIPWarningStore = false;
    socketIO.on(CONST.CONNECT, () => {
      const message = { command: CONST.LIST, set: CONST.QUEUE, id: CONST.INIT_LIST, key: CONST.LIST };
      socketIO.emit(CONST.MESSAGE, message);
      socketIO.emit(CONST.JOIN, $requesterIDStore);
    });

    if (browser) {
      // Register a listener to trigger an event if the content of the tab has become visible or hidden
      window.addEventListener(CONST.VISIBILITY_CHANGE, () => {
        sendBrowserVisibilityStatus(
          document.visibilityState === CONST.VISIBILITY_HIDDEN
            ? BROWSER_VISIBILITY_STATUS.INACTIVE
            : BROWSER_VISIBILITY_STATUS.ACTIVE
        );
      });
    }

    if (!isDevice && isSIP) {
      displayNotification({ value: NOTIFICATION_VALUES.SIP_ERROR });
      disableJoinButton = true;
      disableSIPOption = true;
    }

    return () => {
      socketIO.disconnect();
    };
  });
</script>

<div class="is-flex is-justify-content-center is-align-items-center is-fullheight" style="width: 100%">
  <span class="bulma-loader-mixin" class:is-hidden={!iframeIsLoading} style="position:absolute" />
  {#if displayIframe}
    <div style="{embeddable ? 'height: 43rem' : 'height: 48rem'}; width:100%">
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
    </div>
  {/if}
  {#if meetingInSession}
    <div class="flash box is-flex is-flex-direction-column is-translucent-black pb-5" style="padding: 2rem;">
      <div class=" title has-text-white is-size-5 mb-4">Meeting In Session!</div>
    </div>
  {/if}
  {#if !displayIframe}
    <div
      class="box is-flex is-flex-direction-column is-translucent-black pb-5 mx-5"
      class:embeddable
      style={embeddable ? 'padding: 1.5rem; width: 20rem' : 'padding: 2rem; min-width: 30rem'}
    >
      {#if readyToJoin}
        <div class="has-text-centered has-text-white {embeddable ? 'is-size-6' : 'is-size-5'} mb-4">
          Representative is Now Available!
        </div>
        <button
          class="button {embeddable ? 'is-size-6' : 'is-size-5'} mt-6 is-primary is-centered"
          on:click={() => joinSession(incomingMeetingURL)}
          >Join Support Session
        </button>
      {:else if requestSubmitted}
        <div class="{embeddable ? 'is-size-6' : 'is-size-5'} has-text-white has-text-centered">
          Your request has been queued. A representative will reach out shortly.
        </div>
        <span class="has-text-white has-text-centered flash" style="margin-top: 1.5rem; font-size: 0.9rem;">
          {$queueOrderStore === 0 ? 'You are next!' : `There are ${$queueOrderStore} additional requests ahead of you.`}
        </span>
        <button
          class="button {embeddable ? 'is-size-6' : 'is-size-5'} mt-6 is-danger is-centered"
          on:click={cancelRequest}
          >Cancel Request
        </button>
      {:else}
        <div>
          <div class="has-text-centered">
            <!-- {title} -->
            <img style={embeddable ? 'height: 10rem' : 'height: 15rem'} src={sipImage} alt={''} on:load />
          </div>
          <button
            class="button {embeddable ? 'is-size-5' : 'is-size-4'} is-primary is-centered  {isLoading && 'is-loading'}"
            style={embeddable ? 'margin-top: 1rem; width: 100%;' : 'margin-top: 1.25rem; width: 100%;'}
            on:click={submitRequest}
            >{title}
          </button>
          <div
            class="control is-justify-content-space-around is-flex has-text-white is-size-6"
            style={embeddable ? 'margin: 0.5rem 0 0 0;' : 'margin: 1rem 0 0.25rem 0'}
          >
            {#if displayMeetingOptions}
              {#if isSDK}
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
              {#if isIC}
                <label id="ic-checkbox" class="radio ml-4">
                  <input
                    type="radio"
                    name="meeting"
                    checked={meetingType === MEETING_TYPE_OPTIONS.INSTANT_CONNECT}
                    value={MEETING_TYPE_OPTIONS.INSTANT_CONNECT}
                    on:change={(e) => (meetingType = MEETING_TYPE_OPTIONS.INSTANT_CONNECT)}
                  />
                  <span class="is-hidden-mobile">Instant Connect</span>
                  <span class="is-hidden-tablet  ">IC</span>
                </label>
              {/if}
              {#if isSIP}
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
          {#if !(isSIP && !isIC && !isSDK)}
            <div class="has-text-white has-text-centered mt-5" style="font-size: 0.65rem ">
              * Unanswered request will auto-expire in 30 minutes
            </div>
          {/if}
        </div>
      {/if}
    </div>
  {/if}
</div>
