<script lang="ts">
  import { onMount } from 'svelte';
  import { io } from 'socket.io-client';
  import type { Socket } from 'socket.io-client';

  import { browser } from '$app/env';

  import { queueOrderStore, requesterIDStore } from '$lib/store';
  import * as CONST from './constants';

  import { BROWSER_VISIBILITY_STATUS, MEETING_TYPE_OPTIONS, SESSION_STATUS } from '$lib/enums';
  import type { RequestInfo } from '$lib/types';

  import Modal from '$components/Modal/Modal.svelte';

  export let socketID: string;
  export let isSDKAvailable: boolean;
  export let isICAvailable: boolean;
  export let isSIPAvailable: boolean;

  let requestSubmitted = false;
  let readyToJoin: boolean = false;
  let displayIframe: boolean = false;
  let showModal: boolean = false;
  let iframeIsLoading: boolean = false;
  let meetingInSession: boolean = false;
  let isSip: boolean = false;

  let meetingURL: string = '';
  let incomingMeetingURL: string = '';

  let meetingType: MEETING_TYPE_OPTIONS =
    (isSDKAvailable && MEETING_TYPE_OPTIONS.BROWSER_SDK) ||
    (isICAvailable && MEETING_TYPE_OPTIONS.INSTANT_CONNECT) ||
    ((isSIPAvailable && MEETING_TYPE_OPTIONS.SIP_URI_DIALING) as MEETING_TYPE_OPTIONS);

  let displayMeetingOptions = isICAvailable && isSDKAvailable;
  let requestInfo: RequestInfo;

  const socketIO = io(import.meta.env.PUBLIC_SOAP_BOX_URL, { query: { room: socketID } });

  $requesterIDStore = $requesterIDStore ? $requesterIDStore : crypto.randomUUID();

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

      //todo : fix the event name
      if (payload.set === 'SIP_ADDRESS' && requesterID === payload.data.id) {
        callback(CONST.SIP_JOIN_SESSION, { meetingUrl: payload.data.link });
      }

      //todo : fix the event name
      if (payload.set === 'REMOVE_SIP_ADDRESS' && requesterID === payload.data.gradNurseID) {
        callback(CONST.SIP_LEAVE_SESSION);
      }

      if (payload.command === CONST.HSET) {
        callback(CONST.UPDATE_REQUEST, { data: payload.data });
      }
    });
  };

  socketEventHandler(socketIO, $requesterIDStore, (event, payload = {}) => {
    switch (event) {
      case CONST.SDK_JOIN_SESSION:
        readyToJoin = true;
        incomingMeetingURL = `${payload.meetingUrl}&autoDial=true&embedSize=desktop&sessionId=${$requesterIDStore}`;
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
        break;

      case CONST.IC_LEAVE_SESSION:
        displayIframe = false;
        readyToJoin = false;
        iframeIsLoading = false;
        cancelRequest();
        break;

      case CONST.SIP_JOIN_SESSION:
        readyToJoin = true;
        meetingURL = payload.meetingUrl;
        isSip = true;
        break;

      case CONST.SIP_LEAVE_SESSION:
        displayIframe = false;
        readyToJoin = false;
        iframeIsLoading = false;
        meetingInSession = false;
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
    socketIO.emit(CONST.MESSAGE, {
      data: { ...requestInfo, visibilityStatus },
      key: $requesterIDStore,
      set: CONST.QUEUE,
      command: CONST.HSET
    });
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
    // if (isSip) {
    //   meetingInSession = true;
    // }
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

    return () => {
      socketIO.disconnect();
    };
  });
</script>

<div class="columns is-align-items-center is-mobile">
  <div class="column auto">
    <h1 class="is-size-3  has-text-white">Requester View</h1>
  </div>
  <div class="column is-3 is-flex is-justify-content-flex-end" />
</div>
<hr class="mt-4" />
<div class="is-flex is-justify-content-center is-align-items-center is-fullheight ">
  <span class="bulma-loader-mixin" class:is-hidden={!iframeIsLoading} style="position:absolute" />
  <iframe
    width="100%"
    height="100%"
    title="meeting"
    src={meetingURL}
    class:is-hidden={!displayIframe && !meetingInSession}
    allow="camera;microphone"
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
                  checked={meetingType === MEETING_TYPE_OPTIONS.INSTANT_CONNECT}
                  value={MEETING_TYPE_OPTIONS.INSTANT_CONNECT}
                  on:change={(e) => (meetingType = MEETING_TYPE_OPTIONS.INSTANT_CONNECT)}
                />
                <span class="is-hidden-mobile">Instance Connect</span>
                <span class="is-hidden-tablet">IC</span>
              </label>
            {/if}
            {#if isSIPAvailable}
              <label id="sip-checkbox" class="radio ml-4">
                <input
                  type="radio"
                  name="meeting"
                  checked={meetingType === MEETING_TYPE_OPTIONS.SIP_URI_DIALING}
                  value={MEETING_TYPE_OPTIONS.SIP_URI_DIALING}
                  on:change={(e) => (meetingType = MEETING_TYPE_OPTIONS.SIP_URI_DIALING)}
                />
                <span>SIP</span>
                <span class="is-hidden-mobile"> URI DIALING </span>
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

<Modal isActive={showModal}>
  <div class="modal-content is-translucent-black" style="padding: 1.5rem 0.5rem; width: 22rem;">
    <div class="has-text-white has-text-centered">
      <div class="subtitle is-size-5 has-text-white mb-2 ">Your request has been canceled</div>
      <div class="subtitle is-size-5 has-text-white">Please try again.</div>
    </div>
    <div class="is-flex is-justify-content-center mt-4">
      <button
        class="button is-success"
        on:click={() => {
          showModal = false;
        }}>Acknowledge</button
      >
    </div>
  </div>
</Modal>
