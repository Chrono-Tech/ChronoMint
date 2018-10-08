/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import * as MiddlewareActions from './actions'

export const middlewareConnect = (dispatch) =>
  dispatch(MiddlewareActions.middlewareConnect())

export const middlewareDisconnect = (dispatch) =>
  dispatch(MiddlewareActions.middlewareDisconnect())

export const middlewareSubscribe = (channel, onMessageThunk) => (dispatch) =>
  dispatch(MiddlewareActions.middlewareSubscribe(channel, onMessageThunk))

export const middlewareUnsubscribe = (channel) => (dispatch) =>
  dispatch(MiddlewareActions.middlewareUnsubscribe(channel))

