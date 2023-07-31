<script lang="ts">
  import { onMount } from 'svelte';
  import { io } from 'socket.io-client';
  import { v4 as uuidv4 } from 'uuid';
  import { browser } from '$app/env';

  import { CLOSE_REQUEST, FORCE_CLOSE_REQUEST } from './constants';
  import type { RequestInfo } from '$lib/types';
  import QueueItem from '$components/RequestDetails/RequestDetails.svelte';
  import { jsonRequest } from '$lib/shared/json-request';

  import type * as TYPES from '$lib/types';
  import * as CONST from './constants';
  import Modal from '$components/Modal/Modal.svelte';
  import { MEETING_TYPE_OPTIONS } from '$lib/enums';
  import { showModalStore } from '$lib/store';

  export let socketID;

  enum SESSION_STATUS {
    VIEW_REQUEST = 'Request Under Review',
    INIT_SESSION = 'Initiating a Session',
    SESSION_IN_PROGRESS = 'Session in Progress'
  }

  let queue: Array<RequestInfo> = [];
  let selectedRequest: RequestInfo;
  let sessionStatus: SESSION_STATUS;

  let displayQueue = true;
  let joinSession = false;
  let joinButtonIsLoading = false;
  let iframeIsLoading = false;

  let meetingURL = '';
  let title = 'Request Queue';

  let iframe: HTMLIFrameElement;
  // let isOnDevice = browser ? (window.navigator.userAgent.includes('RoomOS') ? true : false) : false;

  const socketIO = io(import.meta.env.PUBLIC_SOAP_BOX_URL, { query: { room: socketID } });
  const httpApiRequest = jsonRequest('/api');

  const postMindyResponse = (guid: string) =>
    httpApiRequest.post('mindy', { guid }).then((r) => r.json() as Promise<TYPES.MindyResponse>);

  const postInstantConnectJEResponse = (sub: string) =>
    httpApiRequest.post('instant-connect/joseencrypt', { sub }).then((r) => r.json() as Promise<TYPES.ICResponse>);

  const getInstantConnectTokenResponse = (data: string) =>
    httpApiRequest.get('instant-connect/space', { data }).then((r) => r.json() as Promise<TYPES.ICToken>);

  const isDevice = browser ? (window.navigator.userAgent.includes('RoomOS') ? true : false) : false;
  /**
   * Socket handler to listen and sort all events and pass them to the UI
   *
   * @param socket
   * @param requesterID
   * @param callback
   */
  export const socketEventHandler = (socket: Socket, callback: (event: string, payload?: unknown) => void) => {
    socket.on(CONST.MESSAGE_RESPONSE, (payload) => {
      if (payload.id === CONST.INIT_LIST && payload.data) {
        callback(CONST.LIST_QUEUE, { queue: payload.data });
      }
    });

    socket.on(CONST.MESSAGE, (payload) => {
      if (payload.command === CONST.APPEND) {
        callback(CONST.APPEND_QUEUE, { requesterID: payload.key, newRequest: payload.data });
      }

      if (payload.data?.event === CONST.MEMBERS_UPDATE) {
        if (payload.data.payload.updated.some((participant: any) => participant.isSelf && !participant.isInMeeting)) {
          callback(CONST.SDK_LEAVE_SESSION);
        }
      }

      if (payload.command === CONST.REMOVE) {
        callback(CONST.REMOVE_QUEUE, { requesterID: payload.key });
      }

      if (payload.command === CONST.HSET) {
        callback(CONST.UPDATE_QUEUE, {
          requesterID: payload.key,
          visibilityStatus: payload.data.visibilityStatus,
          sessionStatus: payload.data.sessionStatus,
          meetingLink: payload.data.meetingLink
        });
      }
    });
  };

  socketEventHandler(socketIO, (event, payload) => {
    switch (event) {
      case CONST.APPEND_QUEUE:
        if (!queue.some((q) => q.id === payload.requesterID)) {
          queue = [
            ...queue,
            {
              timeStamp: new Date(),
              id: payload.newRequest.id,
              visibilityStatus: payload.newRequest.visibilityStatus,
              sessionStatus: payload.newRequest.sessionStatus,
              meetingType: payload.newRequest.meetingType
            }
          ];
        }
        break;

      case CONST.REMOVE_QUEUE:
        queue = queue.filter((q) => q.id !== payload.requesterID);

        if (!queue.some((q) => q.id === selectedRequest?.id)) {
          displayQueue = true;
        }

        meetingURL = '';
        displayQueue = true;
        joinButtonIsLoading = false;
        iframeIsLoading = false;
        joinSession = false;
        selectedRequest = undefined;
        break;

      case CONST.UPDATE_QUEUE:
        queue = queue.map((item) => {
          if (item.id === payload.requesterID) {
            if (payload.visibilityStatus) {
              item.visibilityStatus = payload.visibilityStatus;
            }
            if (payload.sessionStatus) {
              item.sessionStatus = payload.sessionStatus;
            }

            if (payload.meetingLink) {
              item.meetingLink = payload.meetingLink;
            }
          }
          return item;
        });
        break;

      case CONST.LIST_QUEUE:
        queue = payload.queue.map((q) => {
          const requestInfoJSON = JSON.parse(q.data);

          return {
            timeStamp: new Date(q.score),
            id: q.value,
            visibilityStatus: requestInfoJSON.visibilityStatus,
            sessionStatus: requestInfoJSON.sessionStatus,
            meetingType: requestInfoJSON.meetingType,
            meetingLink: requestInfoJSON.meetingLink
          };
        });
        break;
    }
  });

  const startGuestDemoSession = async () => {
    if (selectedRequest.sessionStatus === 'active') {
      meetingURL = selectedRequest.meetingLink;
    } else {
      const { redirect } = await postMindyResponse(selectedRequest.id);
      meetingURL = `${redirect}&autoDial=true&embedSize=desktop&sessionId=${uuidv4()}`;
    }
    joinSession = true;
    joinButtonIsLoading = false;
    iframeIsLoading = true;
  };

  const startICSession = async () => {
    const {
      host: [hostData],
      guest: [guestData]
    } = await postInstantConnectJEResponse(uuidv4());
    const { token: hostToken } = await getInstantConnectTokenResponse(hostData.cipher);

    meetingURL = `${import.meta.env.PUBLIC_INSTANT_CONNECT_TALK_URL}?int=jose&v=1&data=${hostData.cipher}`;
    joinSession = true;
    joinButtonIsLoading = false;

    socketIO.emit(CONST.MESSAGE, {
      command: CONST.SET,
      set: CONST.IC_SESSION,
      key: selectedRequest.id,
      data: {
        link: `${import.meta.env.PUBLIC_INSTANT_CONNECT_TALK_URL}?int=jose&v=1&data=${guestData.cipher}`
      },
      id: CONST.SET
    });

    await monitorMeeting(hostToken);
    return meetingURL;
  };

  const monitorMeeting = async (token) => {
    const webexSDK = new window.Webex({
      credentials: {
        access_token: token
      }
    });

    await webexSDK.meetings.register();

    webexSDK.meetings.on(CONST.SDK_MEETING_REMOVED, () => {
      meetingURL = '';
      displayQueue = true;
      joinButtonIsLoading = false;
      joinSession = false;

      socketIO.emit(CONST.MESSAGE, {
        command: CONST.SET,
        set: CONST.IC_SESSION,
        id: CONST.REMOVE,
        key: selectedRequest.id,
        data: selectedRequest
      });
    });
  };

  const startSession = async () => {
    joinButtonIsLoading = true;
    sessionStatus = SESSION_STATUS.INIT_SESSION;
    const { meetingType } = selectedRequest;

    switch (meetingType) {
      case MEETING_TYPE_OPTIONS.INSTANT_CONNECT:
        await startICSession();
        break;
      case MEETING_TYPE_OPTIONS.BROWSER_SDK:
        await startGuestDemoSession();
        break;

      default:
        return;
    }

    sessionStatus = SESSION_STATUS.SESSION_IN_PROGRESS;
    socketIO.emit(CONST.MESSAGE, {
      data: { ...selectedRequest, sessionStatus: CONST.ACTIVE, meetingLink: meetingURL },
      key: selectedRequest.id,
      set: CONST.QUEUE,
      command: CONST.HSET
    });
  };

  const removeQueue = (selectedRequester) => {
    socketIO.emit(CONST.MESSAGE, {
      command: CONST.REMOVE,
      set: CONST.QUEUE,
      data: selectedRequester,
      id: CONST.REMOVE,
      key: selectedRequester.id
    });

    queue = queue.filter((q) => q.id !== selectedRequester.id);
    selectedRequest = undefined;
  };

  const handleClick = (target) => {
    if (target.command) {
      if (target.command === CLOSE_REQUEST) {
        $showModalStore = true;
      } else if (target.command === FORCE_CLOSE_REQUEST) {
        removeQueue(target);
      }
    } else {
      displayQueue = false;
      sessionStatus = SESSION_STATUS.VIEW_REQUEST;
    }
    selectedRequest = target;
  };

  onMount(async () => {
    socketIO.on(CONST.CONNECT, () => {
      socketIO.emit(CONST.MESSAGE, { command: CONST.LIST, set: CONST.QUEUE, id: CONST.INIT_LIST, key: CONST.LIST });
    });
  });

  $: queue = isDevice ? queue.filter((item) => item.meetingType !== MEETING_TYPE_OPTIONS.INSTANT_CONNECT) : queue;
</script>

<div class="columns mb-2 is-align-items-center mb-1">
  <div class="column is-12 is-5 is-size-6 is-hidden-mobile" style="height: 5rem;">
    {#if selectedRequest}
      <div class="columns m-0 is-mobile is-justify-content-space-between has-text-info-light">
        <div>Session ID:</div>
        <div class="has-text-success">
          {selectedRequest.id.split('-')[4]}
        </div>
      </div>
      <div class="columns m-0 is-mobile is-justify-content-space-between has-text-info-light">
        <div>Session Status:</div>
        <div
          class={sessionStatus === SESSION_STATUS.VIEW_REQUEST
            ? 'has-text-warning-dark'
            : sessionStatus === SESSION_STATUS.INIT_SESSION
            ? 'has-text-warning'
            : 'has-text-danger'}
        >
          {sessionStatus}
        </div>
      </div>
      <div class="columns m-0 is-mobile is-justify-content-space-between has-text-info-light">
        <div>Session Provider:</div>
        <div class="has-text-link">
          {#if selectedRequest.meetingType === MEETING_TYPE_OPTIONS.BROWSER_SDK}
            <a target="_blank" href={`${import.meta.env.PUBLIC_WEBEX_DEV_PORTAL_URL}/docs/sdks/browser`}
              >Webex Browser Meeting SDK</a
            >
          {:else}
            <a target="_blank" href={import.meta.env.PUBLIC_INSTANT_CONNECT_GETTING_STARTED_UR}>Webex Instant Connect</a
            >
          {/if}
        </div>
      </div>
    {/if}
  </div>
</div>
<div
  class="is-flex  is-align-items-center is-justify-content-center"
  style="overflow: auto; height: calc(100% - 50px); "
>
  <iframe
    title="meeting"
    width="100%"
    height="100%"
    class:is-hidden={!joinSession}
    bind:this={iframe}
    src={meetingURL}
    allow="camera;microphone; fullscreen;display-capture"
    on:load={() => {
      iframeIsLoading = false;
    }}
  />
  {#if !joinSession}
    {#if displayQueue}
      {#if queue.length === 0}
        <p class="is-flex subtitle has-text-white has-text-centered">There are no requests.</p>
      {:else}
        <div class="is-flex is-flex-direction-column" style="height: 100%;">
          {#each queue as q}
            <QueueItem onClick={handleClick} requestInfo={q} />
          {/each}
        </div>
      {/if}
    {:else}
      <div class="box has-text-centered is-translucent-black p-0">
        <div class="is-flex is-justify-content-flex-end m-2">
          <span
            class={`icon ${!joinButtonIsLoading ? 'has-text-danger' : 'has-text-gray'} ${
              !joinButtonIsLoading && 'is-clickable'
            }`}
            on:click={() => {
              if (!joinButtonIsLoading) {
                selectedRequest = undefined;
                displayQueue = true;
              }
            }}
          >
            <i class="mdi mdi-24px mdi-close" />
          </span>
        </div>
        <div style="padding: 0 1.5rem 1.5rem 1.5rem">
          <div class="subtitle has-text-white has-text-centered is-size-4">Start Support Session</div>
          <button
            class="button is-size-5 mt-5 is-primary is-centered"
            class:is-loading={joinButtonIsLoading}
            on:click={startSession}
            >Join Session
          </button>
        </div>
      </div>
    {/if}
  {/if}
</div>

<Modal>
  <div class="modal-content is-translucent-black" style="padding: 1.75rem 0.5rem; width: 22rem;">
    <div class="has-text-white has-text-centered">
      <div class="subtitle is-size-5 has-text-white mb-2 ">You are about to cancel this request.</div>
      <div class="subtitle is-size-5 has-text-white">The requester will be notified.</div>
      <div class="is-size-6">Would you like to continue?</div>
    </div>
    <div class="is-flex is-justify-content-center mt-4">
      <button
        class="button is-primary mr-6"
        on:click={() => {
          removeQueue(selectedRequest);
          $showModalStore = false;
        }}>Yes</button
      >
      <button
        class="button is-danger"
        on:click={() => {
          $showModalStore = false;
        }}>No</button
      >
    </div>
  </div>
</Modal>
