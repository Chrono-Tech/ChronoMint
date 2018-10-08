/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import * as MiddlewareActionTypes from './constants'

export const middlewareConnect = () => ({
  type: MiddlewareActionTypes.MIDDLEWARE_CONNECT,
})

export const middlewareConnectSuccess = () => ({
  type: MiddlewareActionTypes.MIDDLEWARE_CONNECT_SUCCESS,
})

export const middlewareConnectFailure = (error) => ({
  type: MiddlewareActionTypes.MIDDLEWARE_CONNECT_FAILURE,
  error,
})

export const middlewareDisconnect = () => ({
  type: MiddlewareActionTypes.MIDDLEWARE_DISCONNECT,
})

export const middlewareSubscribe = (channel, onMessageThunk) => ({
  type: MiddlewareActionTypes.MIDDLEWARE_SUBSCRIBE,
  channel,
  onMessageThunk,
})

export const middlewareSubscribeSuccess = (channel) => ({
  type: MiddlewareActionTypes.MIDDLEWARE_SUBSCRIBE_SUCCESS,
  channel,
})

export const middlewareSubscribeFailure = (error) => ({
  type: MiddlewareActionTypes.MIDDLEWARE_SUBSCRIBE_FAILURE,
  error,
})

export const middlewareUnsubscribe = (channel) => ({
  type: MiddlewareActionTypes.MIDDLEWARE_UNSUBSCRIBE,
  channel,
})

