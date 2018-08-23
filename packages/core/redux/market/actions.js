/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import get from 'lodash/get'
import axios from 'axios'
import MarketSocket from '../../market/MarketSocket'
import {
  DUCK_MARKET,
  LAST_MARKET_UPDATE,
  MARKET_ADD_TOKEN,
  MARKET_INIT,
  MARKET_UPDATE_PRICES,
  MARKET_UPDATE_RATES,
} from './constants'
import { chunker } from './utils'

const MARKET_REQUEST_DELAY = 30000

// TODO: to check, why we need this mutable variable exported
// eslint-disable-next-line import/no-mutable-exports
export let timerId

const watchMarket = (dispatch, getState) => async () => {
  const { tokens, currencies } = getState().get(DUCK_MARKET)
  if (tokens.length === 0 || currencies.length === 0) {
    return
  }
  let response = {}
  const tokenList = tokens.join(',')
  const currencyList = currencies.join(',')
  if (tokenList.length > 300) {
    const chunks = chunker(tokens)
    const chunkedResponse = await Promise.all(
      chunks.map((chunk) => axios.get(`https://min-api.cryptocompare.com/data/pricemulti?fsyms=${chunk.join(',')}&tsyms=${currencyList}`))
    )
    response['data'] = {}
    chunkedResponse.forEach((cResponse) => response.data = { ...response.data, ...cResponse.data })
  } else {
    response = await axios.get(`https://min-api.cryptocompare.com/data/pricemulti?fsyms=${tokenList}&tsyms=${currencyList}`)
  }
  Object.keys(response.data).length && dispatch({ type: MARKET_UPDATE_PRICES, prices: response.data })
}

export const watchInitMarket = () => (dispatch, getState) => {
  try {
    MarketSocket.init()
    MarketSocket.on('update', (update) => {
      let updateData = update
      // eslint-disable-next-line prefer-const
      let { rates, lastMarket } = getState().get(DUCK_MARKET)
      if (!lastMarket || !rates) {
        return
      }
      const symbol = updateData.symbol

      // update last market for pare
      if (updateData.LASTMARKET) {
        dispatch({
          type: LAST_MARKET_UPDATE,
          payload: {
            symbol: updateData.symbol,
            lastMarket: updateData.LASTMARKET,
          },
        })
      } else {
        updateData.LASTMARKET = lastMarket[ symbol ]
      }

      lastMarket = updateData.LASTMARKET || get(lastMarket, symbol)
      updateData = { ...get(rates, `${symbol}.${lastMarket}`, undefined), ...updateData }

      const price = updateData.PRICE
      const open24hour = updateData.OPEN24HOUR

      if (price && open24hour) {
        updateData.CHANGE24H = price - open24hour
        updateData.CHANGEPCT24H = updateData.CHANGE24H / open24hour * 100
      }

      dispatch({ type: MARKET_UPDATE_RATES, payload: updateData })
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
