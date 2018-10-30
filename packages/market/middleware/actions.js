/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import {
  CRYPTOCOMPARE_CONNECT_FAILURE,
  CRYPTOCOMPARE_CONNECT_SUCCESS,
  CRYPTOCOMPARE_CONNECT,
  CRYPTOCOMPARE_DISCONNECT_FAILURE,
  CRYPTOCOMPARE_DISCONNECT_SUCCESS,
  CRYPTOCOMPARE_DISCONNECT,
  CRYPTOCOMPARE_RESET_STATE,
  CRYPTOCOMPARE_SET_EVENT_HANDLER_FAILURE,
  CRYPTOCOMPARE_SET_EVENT_HANDLER_SUCCESS,
  CRYPTOCOMPARE_SET_EVENT_HANDLER,
  CRYPTOCOMPARE_START_PRICES_POLLING,
  CRYPTOCOMPARE_STOP_PRICES_POLLING,
  CRYPTOCOMPARE_SUBSCRIBE_FAILURE,
  CRYPTOCOMPARE_SUBSCRIBE_SUCCESS,
  CRYPTOCOMPARE_SUBSCRIBE,
  CRYPTOCOMPARE_UNSET_EVENT_HANDLER_FAILURE,
  CRYPTOCOMPARE_UNSET_EVENT_HANDLER_SUCCESS,
  CRYPTOCOMPARE_UNSET_EVENT_HANDLER,
  CRYPTOCOMPARE_UNSUBSCRIBE_FAILURE,
  CRYPTOCOMPARE_UNSUBSCRIBE_SUCCESS,
  CRYPTOCOMPARE_UNSUBSCRIBE,
  CRYPTOCOMPARE_UPDATE_MARKET_LAST,
  CRYPTOCOMPARE_UPDATE_MARKET_PRICES_FAILURE,
  CRYPTOCOMPARE_UPDATE_MARKET_PRICES,
  CRYPTOCOMPARE_UPDATE_MARKET_RATES,
} from './constants'

export const resetState = () => ({
  type: CRYPTOCOMPARE_RESET_STATE,
})

export const connect = () => ({
  type: CRYPTOCOMPARE_CONNECT,
})

export const connectSuccess = () => ({
  type: CRYPTOCOMPARE_CONNECT_SUCCESS,
})

export const connectFailure = () => ({
  type: CRYPTOCOMPARE_CONNECT_FAILURE,
})

export const disconnect = (isGraceful) => ({
  type: CRYPTOCOMPARE_DISCONNECT,
  isGraceful,
})

export const disconnectSuccess = () => ({
  type: CRYPTOCOMPARE_DISCONNECT_SUCCESS,
})

export const disconnectFailure = () => ({
  type: CRYPTOCOMPARE_DISCONNECT_FAILURE,
})

export const subscribe = () => ({
  type: CRYPTOCOMPARE_SUBSCRIBE,
})

export const subscribeSuccess = () => ({
  type: CRYPTOCOMPARE_SUBSCRIBE_SUCCESS,
})

export const subscribeFailure = () => ({
  type: CRYPTOCOMPARE_SUBSCRIBE_FAILURE,
})

export const unsubscribe = () => ({
  type: CRYPTOCOMPARE_UNSUBSCRIBE,
})

export const unsubscribeSuccess = () => ({
  type: CRYPTOCOMPARE_UNSUBSCRIBE_SUCCESS,
})

export const unsubscribeFailure = () => ({
  type: CRYPTOCOMPARE_UNSUBSCRIBE_FAILURE,
})

export const setEventHandler = (event, action) => ({
  type: CRYPTOCOMPARE_SET_EVENT_HANDLER,
  action,
  event,
})

export const setEventHandlerSuccess = () => ({
  type: CRYPTOCOMPARE_SET_EVENT_HANDLER_SUCCESS,
})

export const setEventHandlerFailure = () => ({
  type: CRYPTOCOMPARE_SET_EVENT_HANDLER_FAILURE,
})

export const unsetEventHandler = (event, action) => ({
  type: CRYPTOCOMPARE_UNSET_EVENT_HANDLER,
  action,
  event,
})

export const unsetEventHandlerSuccess = () => ({
  type: CRYPTOCOMPARE_UNSET_EVENT_HANDLER_SUCCESS,
})

export const unsetEventHandlerFailure = () => ({
  type: CRYPTOCOMPARE_UNSET_EVENT_HANDLER_FAILURE,
})

export const updateMarketRates = (rates) => ({
  type: CRYPTOCOMPARE_UPDATE_MARKET_RATES,
  rates,
})

export const updateMarketPrices = (prices) => ({
  type: CRYPTOCOMPARE_UPDATE_MARKET_PRICES,
  prices,
})

export const updateMarketPricesFailure = (error) => ({
  type: CRYPTOCOMPARE_UPDATE_MARKET_PRICES_FAILURE,
  error,
})

export const startPricesPolling = (interval) => ({
  type: CRYPTOCOMPARE_START_PRICES_POLLING,
  interval,
})

export const stopPricesPolling = () => ({
  type: CRYPTOCOMPARE_STOP_PRICES_POLLING,
})

export const marketLastUpdate = (symbol, lastMarket) => ({
  type: CRYPTOCOMPARE_UPDATE_MARKET_LAST,
  lastMarket,
  symbol,
})
