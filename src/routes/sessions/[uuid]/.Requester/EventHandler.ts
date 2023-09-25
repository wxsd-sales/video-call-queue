import * as CONST from '../constants';

import type { Socket } from 'socket.io-client';


/**
   * Socket handler to listen and sort all events and pass them to the UI
   *
   * @param socket
   * @param requesterID
   * @param callback
   */
export const socketEventHandler = (
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