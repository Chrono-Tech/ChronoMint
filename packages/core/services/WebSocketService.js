/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import SockJS from 'sockjs-client'

const CONNECTION_HEARTBEAT_TIMEOUT = 60000 // 1 minute
const MAX_RECONNECTION_INTERVAL = 60000 // 1 minute
const RECONNECTION_INTERVAL = 10000 // 10 seconds

const WEB_SOCKET_CONNECTED = 'WEB_SOCKET/CONNECTED'
const WEB_SOCKET_DISCONNECTED = 'WEB_SOCKET/DISCONNECTED'
const WEB_SOCKET_ERROR = 'WEB_SOCKET/ERROR'
const WEB_SOCKET_HEARTBEAT = 'WEB_SOCKET/HEARTBEAT'
const WEB_SOCKET_RECONNECTING = 'WEB_SOCKET/RECONNECTING'

const BASE_URL = 'https://rabbitmq-webstomp.chronobank.io/stomp'

const initialState = {
  error: null,
  lastHeartBeat: null,
  reconnectingAttempts: 0,
  status: 0,
  reconnectionInterval: RECONNECTION_INTERVAL,
}

const mutations = {

  [WEB_SOCKET_RECONNECTING]: (state) => ({
    ...state,
    reconnectingAttempts: state.reconnectingAttempts + 1,
    reconnectionInterval: state.reconnectionInterval < MAX_RECONNECTION_INTERVAL
      ? state.reconnectionInterval + RECONNECTION_INTERVAL
      : MAX_RECONNECTION_INTERVAL,
  }),

  [WEB_SOCKET_ERROR]: (state, payload) => ({
    ...state,
    error: payload,
  }),

  [WEB_SOCKET_CONNECTED]: (state) => ({
    ...state,
    status: 1,
    reconnectingAttempts: 0,
    reconnectionInterval: RECONNECTION_INTERVAL,
  }),

  [WEB_SOCKET_DISCONNECTED]: (state) => ({
    ...state,
    status: 3,
  }),

  [WEB_SOCKET_HEARTBEAT]: (state, payload) => ({
    ...state,
    lastHeartBeat: payload,
  }),
}

export const ws = (state = initialState, { type, payload }) =>
  (type in mutations)
    ? mutations[type](state, payload)
    : state

export class WebSocketService {
  static store = null
  static socket = null
  static wsStatusHandlers = null
  static isDisconnectUnexpected = true
  static connectionTimeout = null

  static reconnectByHeartBeatTimeout (customTimeout) {
    clearTimeout(WebSocketService.connectionTimeout)
    WebSocketService.connectionTimeout = null // Just in case of fire
    WebSocketService.connectionTimeout = setTimeout(function () {
      WebSocketService.disconnect(true)
    }, customTimeout || CONNECTION_HEARTBEAT_TIMEOUT)
  }

  static setWebocketHandlers () {
    WebSocketService.socket.onopen = WebSocketService.wsStatusHandlers.onopen
    WebSocketService.socket.onheartbeat = WebSocketService.wsStatusHandlers.onheartbeat
    WebSocketService.socket.onerror = WebSocketService.wsStatusHandlers.onerror
    WebSocketService.socket.onclose = WebSocketService.wsStatusHandlers.onclose
  }

  static initWebSocketService (store) {
    WebSocketService.store = store
    WebSocketService.wsStatusHandlers = {
      onopen: () => {
        store.dispatch({ type: WEB_SOCKET_CONNECTED })
        WebSocketService.reconnectByHeartBeatTimeout(120000)
      },
      onclose: () => {
        store.dispatch({ type: WEB_SOCKET_DISCONNECTED })

        // Conditional attempt to reconnect
        if (WebSocketService.isDisconnectUnexpected) {
          store.dispatch({ type: WEB_SOCKET_RECONNECTING })
          setTimeout(function () {
            WebSocketService.connect(true)
          }, RECONNECTION_INTERVAL)
        }
      },
      onheartbeat: () => {
        // In CONNECTION_HEARTBEAT_TIMEOUT (1 minute) with no heartbeats we will drop WS connection and attempt to reconnect
        WebSocketService.reconnectByHeartBeatTimeout()
        const date =  new Date()
        store.dispatch({ type: WEB_SOCKET_HEARTBEAT, payload: date })

      },
      onerror: (error) => {
        store.dispatch({ type: WEB_SOCKET_ERROR, payload: error })
      },
    }
  }

  static connect () {
    if (!WebSocketService.socket || WebSocketService.socket.readyState !== 1) {
      WebSocketService.isDisconnectUnexpected = true
      WebSocketService.socket = null
      WebSocketService.socket = new SockJS(BASE_URL, null, { transports: ['websocket', 'xhr-polling'] })
      WebSocketService.setWebocketHandlers()
    }
  }

  static disconnect (isDisconnectUnexpected = false) {
    WebSocketService.isDisconnectUnexpected = isDisconnectUnexpected
    WebSocketService.socket && WebSocketService.socket.close()
    // WebSocketService.socket = null
  }

}
