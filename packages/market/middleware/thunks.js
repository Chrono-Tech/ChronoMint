/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { chunker } from './utils'
import * as MarketMiddlewareActions from './actions'
import { selectMarketRates, selectLastMarket, selectMarketTokens, selectMarketCurrencies } from '../redux/selectors'
import { requestPrices } from './httpApi'

// TODO: [AO] need to clarify this algorythm
// From my point of view, it's wrong to update lastMarket and rates separately
export const updateMarket = (updateData) => (
  dispatch,
  getState,
) => {
  if (!updateData) {
    return
  }

  let state = getState()
  const symbol = updateData.symbol
  let newMarketData = Object.assign({}, updateData)

  // update last market for a pare
  if (newMarketData.LASTMARKET) {
    dispatch(MarketMiddlewareActions.marketLastUpdate(symbol, newMarketData.LASTMARKET))
  } else {
    newMarketData.LASTMARKET = selectLastMarket(state)[ symbol ]
  }

  state = getState()
  const lastMarket = newMarketData.LASTMARKET || selectLastMarket(state)
  const rates = selectMarketRates(state)
  newMarketData = {
    ...(rates[symbol] && rates[symbol][lastMarket] || undefined),
    ...newMarketData,
  }

  const price = newMarketData.PRICE
  const open24hour = newMarketData.OPEN24HOUR

  if (price && open24hour) {
    newMarketData.CHANGE24H = price - open24hour
    newMarketData.CHANGEPCT24H = newMarketData.CHANGE24H / open24hour * 100
  }

  dispatch(MarketMiddlewareActions.updateMarketRates(newMarketData))
}

const MAX_FSYMS_LENGTH = 300 // Max length of a string of comma-spearated tokens. See API at https://min-api.cryptocompare.com/
export const requestMarketPrices = () => async (dispatch, getState) => {
  const state = getState()
  const tokens = selectMarketTokens(state)
  const currencies = selectMarketCurrencies(state)
  const tokenList = tokens.join(',')
  const currencyList = currencies.join(',')

  const prices = {}
  if (tokenList.length > MAX_FSYMS_LENGTH) {
    const chunks = chunker(tokens)
    const chunkedResponse = await Promise.all(
      chunks.map((tokensChunk) => requestPrices(tokensChunk.join(','), currencyList)
        .then((responseChunk) => responseChunk)
        .catch((error) => {
          return dispatch(MarketMiddlewareActions.updateMarketPricesFailure(error))
        })
      )
    )

    prices['data'] = {}
    chunkedResponse.forEach((cResponse) => {
      prices.data = { ...prices.data, ...cResponse.data }
    })
  } else {
    try {
      const response  = await requestPrices(tokenList, currencyList)
      prices.data = response.payload.data
    } catch (error) {
      dispatch(MarketMiddlewareActions.updateMarketPricesFailure(error))
      return
    }
  }
  if (prices.data && Object.keys(prices.data).length > 0) {
    dispatch(MarketMiddlewareActions.updateMarketPrices(prices.data))
  }
}

// true means isGraceful disconnect, do not reconnect
export const stopMarket = (isGraceful = true) => (dispatch) => {
  dispatch(MarketMiddlewareActions.disconnect(isGraceful))
  dispatch(MarketMiddlewareActions.stopPricesPolling())
  dispatch(MarketMiddlewareActions.resetState())
}

export const startMarket = () => (dispatch) => {
  const MARKET_REQUEST_DELAY = 30000
  dispatch(MarketMiddlewareActions.connect())
    .then(() => {
      dispatch(MarketMiddlewareActions.connectSuccess())
      dispatch(MarketMiddlewareActions.setEventHandler('m', (data) => {
        dispatch(updateMarket(data))
      }))
      dispatch(MarketMiddlewareActions.setEventHandler('disconnect', (isGraceful) => {
        if (!isGraceful) {
          dispatch(MarketMiddlewareActions.connectFailure())
          dispatch(startMarket())
        }
      }))
      dispatch(MarketMiddlewareActions.subscribe())
    })
    .catch(() => {
      // TODO: to add error handler
    })
  dispatch(MarketMiddlewareActions.startPricesPolling(MARKET_REQUEST_DELAY))
}
