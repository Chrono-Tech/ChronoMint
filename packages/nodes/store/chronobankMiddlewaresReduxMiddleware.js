/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import SockJS from 'sockjs-client'
import Stomp from 'webstomp-client'
import * as MiddlewareActions from '../middleware/actions'
import * as MiddlewareActionTypes from '../middleware/constants'

// WS states
// const CONNECTING = 0
// const OPEN = 1
// const CLOSING = 2
// const CLOSED = 3

const BASE_URL = 'https://rabbitmq-webstomp.chronobank.io/stomp'
const USER = 'rabbitmq_user'
const PASSWORD = '38309100024'

let ws = null // WebSocket
let client = null // Stomp client
let subscriptions = {}

const subscribe = (channel, onMessageThunk, dispatch) => {
  if (!client) {
    throw new Error('Attempt to subscribe failed: ws does not connected!')
  }
  const subscription = client.subscribe(
    channel,
    (message) => {
      try {
        const data = message && message.body && JSON.parse(message.body)
        dispatch(onMessageThunk(null, data))
      } catch (error) {
        dispatch(onMessageThunk(error))
      }
    }
  )
  subscriptions[channel] = subscription
}

const unsubscribe = (channel) => {
  const subscription = subscriptions[channel]
  if (subscription) {
    delete subscriptions[channel]
    subscription.unsubscribe()
  }
}

const unsubscribeAll = () => {
  subscriptions.forEach((subscription) => {
    subscription.unsubscribe()
  })
  subscriptions = {}
}

const onConnectionError = (dispatch) => (error) => {
  dispatch(MiddlewareActions.middlewareConnectFailure(error))
}

const onConnectionSuccess = (dispatch) => () => {
  dispatch(MiddlewareActions.middlewareConnectSuccess())
}

const connect = (dispatch) => {
  ws = ws || new SockJS(BASE_URL)
  client = Stomp.over(ws, {
    heartbeat: false,
    debug: false,
  })
  client.connect(
    USER,
    PASSWORD,
    onConnectionSuccess(dispatch),
    onConnectionError(dispatch),
  )
  this.clients.push({ nodeName: client })
  return true
}

const disconnect = () =>
  ws.close()

const mutations = {

  [MiddlewareActionTypes.MIDDLEWARE_CONNECT]: (store) => {
    connect(store.dispatch)
  },

  [MiddlewareActionTypes.MIDDLEWARE_DISCONNECT]: () => {
    unsubscribeAll()
    disconnect()
  },

  [MiddlewareActionTypes.MIDDLEWARE_SUBSCRIBE]: (store, payload) => {
    try {
      subscribe(payload.channel, payload.onMessageThunk, store.dispatch)
      return store.dispatch(MiddlewareActions.middlewareSubscribeSuccess(payload.channel))
    } catch (error) {
      return store.dispatch(MiddlewareActions.middlewareSubscribeFailure(error))
    }
  },

  [MiddlewareActionTypes.MIDDLEWARE_UNSUBSCRIBE]: (store, payload) => {
    if (payload && payload.channel) {
      unsubscribe(payload.channel)
    } else {
      unsubscribeAll()
    }
  },

}

export default (store) => (next) => (action) => {
  const { type, ...payload } = action
  return (action.type in mutations)
    ? mutations[type](store, payload)
    : next(action)
}
