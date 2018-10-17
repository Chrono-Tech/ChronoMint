/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import * as ActionTypes from './constants'
import initialState from '../redux/initialState'

const infoReducer = (state) => state

const connect = (state) => ({
  ...state,
  socketStatus: 'connecting',
})

const disconnect = (state) => ({
  ...state,
  socketStatus: 'disconnecting',
})

const connectSuccess = (state) => ({
  ...state,
  socketStatus: 'connected',
  initState: true,
})

const disconnectSuccess = (state) => ({
  ...state,
  socketStatus: 'disconnected',
})

const connectFailure = (state) => ({
  ...state,
  socketStatus: 'connect error',
})

const disconnectFailure = (state) => ({
  ...state,
  socketStatus: 'disconnect error',
})

const marketUpdateRates = (state, { rates }) => ({
  ...state,
  rates: {
    ...state.rates,
    [rates.symbol]: {
      ...(state.rates[rates.symbol] || {}),
      [rates.LASTMARKET]: {
        ...rates,
      },
    },
  },
})

const marketUpdatePrices = (state, { prices }) => ({
  ...state,
  prices,
})

const marketLastUpdate = (state, payload) => ({
  ...state,
  lastMarket: {
    ...state.lastMarket,
    [payload.symbol]: payload.lastMarket,
  },
})

const resetState = () => initialState

const mutations = {
  [ActionTypes.CRYPTOCOMPARE_CONNECT_FAILURE]: connectFailure,
  [ActionTypes.CRYPTOCOMPARE_CONNECT_SUCCESS]: connectSuccess,
  [ActionTypes.CRYPTOCOMPARE_CONNECT]: connect,

  [ActionTypes.CRYPTOCOMPARE_DISCONNECT_FAILURE]: disconnectFailure,
  [ActionTypes.CRYPTOCOMPARE_DISCONNECT_SUCCESS]: disconnectSuccess,
  [ActionTypes.CRYPTOCOMPARE_DISCONNECT]: disconnect,

  [ActionTypes.CRYPTOCOMPARE_SET_EVENT_HANDLER_FAILURE]: infoReducer,
  [ActionTypes.CRYPTOCOMPARE_SET_EVENT_HANDLER_SUCCESS]: infoReducer,
  [ActionTypes.CRYPTOCOMPARE_SET_EVENT_HANDLER]: infoReducer,

  [ActionTypes.CRYPTOCOMPARE_START_PRICES_POLLING]: infoReducer,
  [ActionTypes.CRYPTOCOMPARE_STOP_PRICES_POLLING]: infoReducer,
  [ActionTypes.CRYPTOCOMPARE_SUBSCRIBE]: infoReducer,
  [ActionTypes.CRYPTOCOMPARE_UNSUBSCRIBE]: infoReducer,
  [ActionTypes.CRYPTOCOMPARE_RESET_STATE]: resetState,

  [ActionTypes.CRYPTOCOMPARE_UPDATE_MARKET_LAST]: marketLastUpdate,
  [ActionTypes.CRYPTOCOMPARE_UPDATE_MARKET_RATES]: marketUpdateRates,
  [ActionTypes.CRYPTOCOMPARE_UPDATE_MARKET_PRICES]: marketUpdatePrices,
}

export default mutations
