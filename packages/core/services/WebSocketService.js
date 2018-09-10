/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import SockJS from 'sockjs-client'

const CONNECTING = 0
const OPEN = 1
const CLOSING = 2
const CLOSED = 3

const CONNECTION_HEARTBEAT_TIMEOUT = 60000 // 1 minute
const MAX_RECONNECTION_INTERVAL = 60000 // 1 minute
const RECONNECTION_INTERVAL = 10000 // 10 seconds

const MIDDLEWARE_WEB_SOCKET_CONNECTED = 'MIDDLEWARE/WEB_SOCKET/CONNECTED'
const MIDDLEWARE_WEB_SOCKET_DISCONNECTED = 'MIDDLEWARE/WEB_SOCKET/DISCONNECTED'
const MIDDLEWARE_WEB_SOCKET_ERROR = 'MIDDLEWARE/WEB_SOCKET/ERROR'
const MIDDLEWARE_WEB_SOCKET_HEARTBEAT = 'MIDDLEWARE/WEB_SOCKET/HEARTBEAT'
const MIDDLEWARE_WEB_SOCKET_RECONNECTING = 'MIDDLEWARE/WEB_SOCKET/RECONNECTING'

const BASE_URL = 'https://rabbitmq-webstomp.chronobank.io/stomp'

const initialState = {}

const mutations = {

  [MIDDLEWARE_WEB_SOCKET_RECONNECTING]: (state, payload) => ({
    ...state,
    [payload.wsInternalKey]: {
      ...state[payload.wsInternalKey],
      reconnectingAttempts: state[payload.wsInternalKey].reconnectingAttempts + 1,
      reconnectionInterval: state[payload.wsInternalKey].reconnectionInterval < MAX_RECONNECTION_INTERVAL
        ? state[payload.wsInternalKey].reconnectionInterval + RECONNECTION_INTERVAL
        : MAX_RECONNECTION_INTERVAL,
    },
  }),

  [MIDDLEWARE_WEB_SOCKET_ERROR]: (state, payload) => ({
    ...state,
    [payload.wsInternalKey]: {
      ...state[payload.wsInternalKey],
      error: payload.error,
    },
  }),

  [MIDDLEWARE_WEB_SOCKET_CONNECTED]: (state, payload) => ({
    ...state,
    [payload.wsInternalKey]: {
      ...state[payload.wsInternalKey],
      status: OPEN,
    },
  }),

  [MIDDLEWARE_WEB_SOCKET_DISCONNECTED]: (state, payload) => ({
    ...state,
    [payload.wsInternalKey]: {
      ...state[payload.wsInternalKey],
      status: CLOSED,
    },
  }),

  [MIDDLEWARE_WEB_SOCKET_HEARTBEAT]: (state, payload) => ({
    ...state,
    [payload.wsInternalKey]: {
      ...state[payload.wsInternalKey],
      lastHeartBeat: payload.lastHeartBeat,
    },
  }),
}

export const middlewareWebSocketReducer = (state = initialState, { type, payload }) =>
  (type in mutations)
    ? mutations[type](state, payload)
    : state

export class WebSocketService {
  static store = null
  static sockets = {}
  static wsStatusHandlers = null

  static reconnectByHeartBeatTimeout (wsInternalKey, customTimeout) {
    const selectedWs = WebSocketService.sockets[wsInternalKey]
    clearTimeout(selectedWs.connectionTimeout)
    selectedWs.connectionTimeout = null // Just in case of fire
    selectedWs.connectionTimeout = setTimeout(function () {
      WebSocketService.disconnect(wsInternalKey, true)
    }, customTimeout || CONNECTION_HEARTBEAT_TIMEOUT)
  }

  static initWebSocketService (store) {
    WebSocketService.store = store
    WebSocketService.wsStatusHandlers = {

      onopen: (wsInternalKey) => () => {
        store.dispatch({
          type: MIDDLEWARE_WEB_SOCKET_CONNECTED,
          payload: {
            [wsInternalKey] : {
              error: null,
              lastHeartBeat: null,
              reconnectingAttempts: 0,
              reconnectionInterval: RECONNECTION_INTERVAL,
              status: OPEN,
            },
          },
        })
        WebSocketService.reconnectByHeartBeatTimeout(wsInternalKey, 120000)
      },

      onclose: (wsInternalKey) => () => {
        store.dispatch({
          type: MIDDLEWARE_WEB_SOCKET_DISCONNECTED,
          payload: { wsInternalKey },
        })

        // Conditional attempt to reconnect
        const selectedWs = WebSocketService.sockets[wsInternalKey]
        if (selectedWs.isDisconnectUnexpected) {
          store.dispatch({
            type: MIDDLEWARE_WEB_SOCKET_RECONNECTING,
            payload: { wsInternalKey },
          })
          setTimeout(function () {
            WebSocketService.connect(wsInternalKey, true)
          }, RECONNECTION_INTERVAL)
        }
      },

      onheartbeat:  (wsInternalKey) => () => {
        // In CONNECTION_HEARTBEAT_TIMEOUT (1 minute) with no heartbeats
        // we will drop WS connection and attempt to reconnect
        WebSocketService.reconnectByHeartBeatTimeout(wsInternalKey)
        const lastHeartBeat =  new Date()
        store.dispatch({
          type: MIDDLEWARE_WEB_SOCKET_HEARTBEAT,
          payload: { lastHeartBeat, wsInternalKey },
        })

      },

      onerror:  (wsInternalKey) => (error) => {
        store.dispatch({
          type: MIDDLEWARE_WEB_SOCKET_ERROR,
          payload: { error, wsInternalKey },
        })
      },
    }
  }

  static setConnected (wsInternalKey, state = true) {
    WebSocketService.sockets[wsInternalKey].connectedToMiddleware = state
  }

  static connect (wsInternalKey) {
    if (!WebSocketService.wsStatusHandlers) {
      return null
    }
    // if (!WebSocketService.wsStatusHandlers) {
    //   throw new Error('Initialize WebSocketService before connect!')
    // }

    const selectedWs = WebSocketService.sockets[wsInternalKey]

    if (!selectedWs || (selectedWs.readyState !== OPEN && selectedWs.readyState !== CONNECTING)) {
      const socket = new SockJS(BASE_URL, null, { transports: ['websocket', 'xhr-polling'] })
      socket.onheartbeat = WebSocketService.wsStatusHandlers.onheartbeat(wsInternalKey)
      // WebSocketService.sockets[wsInternalKey] = new SockJS(BASE_URL, null, { transports: ['websocket', 'xhr-polling'] })

      // const selectedWs =  WebSocketService.sockets[wsInternalKey]
      // selectedWs.isDisconnectUnexpected = true

      // // Workaround for issue with webstomp.js
      // selectedWs.CONNECTING = 0
      // selectedWs.OPEN = 1
      // selectedWs.CLOSING = 2
      // selectedWs.CLOSED = 3
      // selectedWs.protocol = 'v12.stomp'

      // Set handlers
      // selectedWs.onopen = WebSocketService.wsStatusHandlers.onopen(wsInternalKey)
      WebSocketService.sockets[wsInternalKey] = socket
      // selectedWs.onerror = WebSocketService.wsStatusHandlers.onerror(wsInternalKey)
      // selectedWs.onclose = WebSocketService.wsStatusHandlers.onclose(wsInternalKey)
      return WebSocketService.sockets[wsInternalKey]
    }

    return selectedWs
  }

  static disconnect (wsInternalKey, isDisconnectUnexpected = false) {
    const selectedWs = WebSocketService.sockets[wsInternalKey]
    if (selectedWs && (selectedWs.readyState !== CLOSING || selectedWs.readyState !== CLOSED)) {
      selectedWs.isDisconnectUnexpected = isDisconnectUnexpected
      selectedWs.close()
    }
  }

}
