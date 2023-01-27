<script lang="ts">
  import { onMount } from 'svelte';
  import { io } from 'socket.io-client';

  import { CLOSE_REQUEST, FORCE_CLOSE_REQUEST } from './constants';
  import type { RequestInfo } from '$lib/types';
  import QueueItem from '$components/RequestDetails/RequestDetails.svelte';
  import { jsonRequest } from '$lib/shared/json-request';

  import type * as TYPES from '$lib/types';
  import * as CONST from './constants';
  import Modal from '$components/Modal/Modal.svelte';
  import { MEETING_TYPE_OPTIONS } from '$lib/enums';
  import supportImg from '$lib/assets/support.svg';

  export let socketID;

  let queue: Array<RequestInfo> = [];
  let selectedRequest: RequestInfo;

  let displayQueue = true;
  let joinSession = false;
  let joinButtonIsLoading = false;
  let iframeIsLoading = false;
  let showModal = false;

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
          sessionStatus: payload.data.sessionStatus
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
            meetingType: requestInfoJSON.meetingType
          };
        });
        break;
    }
  });

  const startGuestDemoSession = async () => {
    const { redirect } = await postMindyResponse(selectedRequest.id);
    meetingURL = `${redirect}&autoDial=true&embedSize=desktop&sessionId=${crypto.randomUUID()}`;
    joinSession = true;
    joinButtonIsLoading = false;
    iframeIsLoading = true;
  };

  const startICSession = async () => {
    const {
      host: [hostData],
      guest: [guestData]
    } = await postInstantConnectJEResponse('calling-queue-demo');
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
  };

  // const startSIPSession = async () => {
  //   try {
  //     joinSession = true;
  //     joinButtonIsLoading = false;
  //     iframeIsLoading = true;
  //     const {
  //       data: { hostToken, sipAddress }
  //     } = await axios({
  //       method: 'post',
  //       url: import.meta.env.PUBLIC_NODE_SERVER_URL_SIP_DEMO,
  //       data: {
  //         guid: selectedGradNurse.ID
  //       }
  //     });
  //     await monitorMeeting(hostToken, sipAddress);
  //     meetingURL = `sip:${sipAddress}`;
  //     iframeIsLoading = false;
  //     HCA_MAIN_SOCKET.emit('message', {
  //       command: 'set',
  //       set: 'SIP_ADDRESS',
  //       data: {
  //         gradNurseID: selectedGradNurse.ID,
  //         link: meetingURL
  //       }
  //     });
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  const monitorMeeting = async (token, sip = '') => {
    const webexSDK = new window.Webex({
      credentials: {
        access_token: token
      }
    });

    await webexSDK.meetings.register();

    if (sip !== '') {
      const meeting = await webexSDK.meetings.create(sip);
      await meeting.join();
      meeting.members.on(CONST.SDK_MEMBERS_UPDATE, async ({ delta, full }) => {
        const newMembers = Object.values({ ...full, ...delta.updated, ...delta.added });
        newMembers.forEach((nm) => {
          if (nm.isInLobby) {
            meeting.members.admitMembers([nm.id]);
          }
        });

        const members = Object.values({ ...full, ...delta.updated, ...delta.added });
        const guestHasLeft = members.some((member) => member.isGuest && member.status === 'NOT_IN_MEETING');

        if (guestHasLeft) {
          meetingURL = '';
          displayQueue = true;
          joinButtonIsLoading = false;
          joinSession = false;

          socketIO.emit(CONST.MESSAGE, {
            command: CONST.SET,
            set: 'REMOVE_SIP_ADDRESS',
            data: {
              gradNurseID: selectedRequest.ID
            }
          });
        }
      });
    }

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

    socketIO.emit(CONST.MESSAGE, {
      data: { ...selectedRequest, sessionStatus: CONST.ACTIVE },
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
  };

  const handleClick = (selectedRequester) => {
    if (selectedRequester.command) {
      if (selectedRequester.command === CLOSE_REQUEST) {
        showModal = true;
      } else if (selectedRequester.command === FORCE_CLOSE_REQUEST) {
        removeQueue(selectedRequester);
      }
    } else {
      displayQueue = false;
    }

    selectedRequest = selectedRequester;
  };

  onMount(async () => {
    socketIO.on(CONST.CONNECT, () => {
      socketIO.emit(CONST.MESSAGE, { command: CONST.LIST, set: CONST.QUEUE, id: CONST.INIT_LIST, key: CONST.LIST });
    });
  });
</script>

<div class="columns  is-mobile is-align-items-center">
  <div class="column auto">
    <h1 class="is-size-3 has-text-white">Responder View</h1>
  </div>
  <div class="column is-3 is-flex is-justify-content-flex-end">
    <figure class="image is-64x64">
      <img src={supportImg} />
    </figure>
  </div>
</div>
<hr class="mt-4" />
<div class="is-flex is-fullheight is-align-items-center is-justify-content-center" style="overflow: auto">
  <iframe
    title="meeting"
    width="100%"
    height="100%"
    class:is-hidden={!joinSession}
    bind:this={iframe}
    src={meetingURL}
    allow="camera;microphone"
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
            class="icon has-text-danger is-clickable"
            on:click={() => {
              displayQueue = true;
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

<Modal isActive={showModal}>
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
          showModal = false;
        }}>Yes</button
      >
      <button
        class="button is-danger"
        on:click={() => {
          showModal = false;
        }}>No</button
      >
    </div>
  </div>
</Modal>
