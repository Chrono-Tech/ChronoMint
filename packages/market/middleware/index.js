/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import * as CryptocompareActions from './actions'
import * as MarketThunks from './thunks'
import CryptocompareSocket from './CryptocompareSocket'
import {
  CRYPTOCOMPARE_CONNECT,
  CRYPTOCOMPARE_DISCONNECT,
  CRYPTOCOMPARE_SET_EVENT_HANDLER,
  CRYPTOCOMPARE_START_PRICES_POLLING,
  CRYPTOCOMPARE_STOP_PRICES_POLLING,
  CRYPTOCOMPARE_SUBSCRIBE,
  CRYPTOCOMPARE_UNSET_EVENT_HANDLER,
  CRYPTOCOMPARE_UNSUBSCRIBE,
} from './constants'

const createCryptoCompareMiddleware = () => {

  let pricePollingTimer = null

  const connect = (dispatch) => {
    return CryptocompareSocket
      .connect()
      .then(() => {
        dispatch(CryptocompareActions.connectSuccess())
        return Promise.resolve()
      })
      .catch((error) => {
        dispatch(CryptocompareActions.connectFailure(error))
        return Promise.reject(error)
      })
  }

  const disconnect = (dispatch, action) => {
    return CryptocompareSocket
      .disconnect(action.isGraceful)
      .then(() => {
        dispatch(CryptocompareActions.disconnectSuccess())
        return Promise.resolve()
      })
      .catch((error) => {
        dispatch(CryptocompareActions.disconnectFailure(error))
        return Promise.reject(error)
      })
  }

  const subscribe = (dispatch) => {
    return CryptocompareSocket
      .subscribe()
      .then(() => {
        dispatch(CryptocompareActions.subscribeSuccess())
        return Promise.resolve()
      })
      .catch((error) => {
        dispatch(CryptocompareActions.subscribeFailure(error))
        return Promise.reject(error)
      })
  }

  const unsubscribe = (dispatch) => {
    return CryptocompareSocket
      .unsubscribe()
      .then(() => {
        dispatch(CryptocompareActions.unsubscribeSuccess())
        return Promise.resolve()
      })
      .catch((error) => {
        dispatch(CryptocompareActions.unsubscribeFailure(error))
        return Promise.reject(error)
      })
  }

  const setEventHandler = (dispatch, action) => {
    return CryptocompareSocket
      .setEventHandler(action.event, action.action)
      .then(() => {
        dispatch(CryptocompareActions.setEventHandlerSuccess())
        return Promise.resolve()
      })
      .catch((error) => {
        dispatch(CryptocompareActions.setEventHandlerFailure(error))
        return Promise.reject(error)
      })
  }

  const unsetEventHandler = (dispatch, action) => {
    return CryptocompareSocket
      .unsetEventHandler(action.event, action.action)
      .then(() => {
        dispatch(CryptocompareActions.unsetEventHandlerSuccess())
        return Promise.resolve()
      })
      .catch((error) => {
        dispatch(CryptocompareActions.unsetEventHandlerFailure(error))
        return Promise.reject(error)
      })
  }

  const startPricesPolling = (dispatch, action) => {
    pricePollingTimer && clearInterval(pricePollingTimer)
    dispatch(MarketThunks.requestMarketPrices())
    pricePollingTimer = setInterval(() => {
      dispatch(MarketThunks.requestMarketPrices())
    }, action.interval)
  }

  const stopPricesPolling = () => {
    clearInterval(pricePollingTimer)
  }

  const mutations = {
    [CRYPTOCOMPARE_CONNECT]: connect,
    [CRYPTOCOMPARE_DISCONNECT]: disconnect,
    [CRYPTOCOMPARE_SUBSCRIBE]: subscribe,
    [CRYPTOCOMPARE_UNSUBSCRIBE]: unsubscribe,
    [CRYPTOCOMPARE_SET_EVENT_HANDLER]: setEventHandler,
    [CRYPTOCOMPARE_UNSET_EVENT_HANDLER]: unsetEventHandler,
    [CRYPTOCOMPARE_START_PRICES_POLLING]: startPricesPolling,
    [CRYPTOCOMPARE_STOP_PRICES_POLLING]: stopPricesPolling,
  }

  return (store) => (next) => (action) => {
    const { type } = action
    if (type in mutations) {
      return mutations[type](store.dispatch, action)
    }
    return next(action)
  }
}

export default createCryptoCompareMiddleware
