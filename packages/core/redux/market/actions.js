/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import axios from 'axios'
import get from 'lodash/get'

import MarketSocket from '../../market/MarketSocket'

export const DUCK_MARKET = 'market'

export const MARKET_INIT = 'market/INIT'
export const MARKET_ADD_TOKEN = 'market/ADD_TOKEN'
export const MARKET_UPDATE_PRICES = 'market/UPDATE_PRICES'
export const MARKET_UPDATE_RATES = 'market/UPDATE_RATES'
export const LAST_MARKET_UPDATE = 'market/UPDATE_LAST_MARKET'
export const SET_SELECTED_COIN = 'market/SET_SELECTED_COIN'

const MARKET_REQUEST_DELAY = 30000
export let timerId

const watchMarket = (dispatch, getState) => async () => {
  const { tokens, currencies } = getState().get(DUCK_MARKET)
  if (tokens.length === 0 || !currencies.length === 0) {
    return
  }
  const response = await axios.get(`https://min-api.cryptocompare.com/data/pricemulti?fsyms=${tokens.join(',')}&tsyms=${currencies.join(',')}`)
  const prices = response ? response.data : {}
  dispatch({ type: MARKET_UPDATE_PRICES, prices })
}

export const watchInitMarket = () => (dispatch, getState) => {
  try {
    MarketSocket.init()
    MarketSocket.on('update', (update) => {
      let { rates, lastMarket } = getState().get(DUCK_MARKET)
      if (!lastMarket || !rates) {
        return
      }
      const symbol = update.symbol

      // update last market for pare
      if (update.LASTMARKET) {
        dispatch({
          type: LAST_MARKET_UPDATE,
          payload: {
            symbol: update.symbol,
            lastMarket: update.LASTMARKET,
          },
        })
      } else {
        update.LASTMARKET = lastMarket[ symbol ]
      }

      lastMarket = update.LASTMARKET || get(lastMarket, symbol)
      update = {
        ...get(rates, `${symbol}.${lastMarket}`, undefined),
        ...update,
      }

      const price = update.PRICE
      const open24hour = update.OPEN24HOUR

      if (price && open24hour) {
        update.CHANGE24H = price - open24hour
        update.CHANGEPCT24H = update.CHANGE24H / open24hour * 100
      }

      dispatch({ type: MARKET_UPDATE_RATES, payload: update })
    })
    MarketSocket.start()

    watchMarket(dispatch, getState)()
    timerId = setInterval(watchMarket(dispatch, getState), MARKET_REQUEST_DELAY)
    dispatch({ type: MARKET_INIT, isInited: true })
  } catch (e) {
    // eslint-disable-next-line
    console.error('init market error', e)
    dispatch({ type: MARKET_INIT, isInited: false })
  }
}

export const watchStopMarket = () => (dispatch) => {
  if (timerId) {
    clearInterval(timerId)
  }
  dispatch({ type: MARKET_INIT, isInited: false })
}

export const addMarketToken = (symbol: string) => (dispatch) => {
  dispatch({ type: MARKET_ADD_TOKEN, symbol })
}
