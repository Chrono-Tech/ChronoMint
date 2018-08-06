/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import {
  LAST_MARKET_UPDATE,
  MARKET_ADD_TOKEN,
  MARKET_INIT,
  MARKET_UPDATE_PRICES,
  MARKET_UPDATE_RATES,
  SET_SELECTED_COIN,
} from './constants'

export const initialState = {
  isInited: false,
  tokens: ['ETH', 'TIME'],
  currencies: ['USD'],
  prices: {},
  rates: {},
  selectedCurrency: 'USD',
  lastMarket: {},
  selectedCoin: 'ETH',
}

export default (state = initialState, action) => {
  switch (action.type) {
    case MARKET_INIT:
      return {
        ...state,
        isInited: action.isInited,
      }
    case MARKET_ADD_TOKEN:
      return {
        ...state,
        tokens: [...state.tokens, action.symbol],
      }
    case MARKET_UPDATE_PRICES:
      return {
        ...state,
        prices: action.prices,
      }
    case MARKET_UPDATE_RATES:
      return {
        ...state,
        rates: {
          ...state.rates,
          [action.payload.symbol]: {
            ...(state.rates[action.payload.symbol] || {}),
            [action.payload.LASTMARKET]: {
              ...action.payload,
            },
          },
        },
      }
    case LAST_MARKET_UPDATE:
      return {
        ...state,
        lastMarket: {
          ...state.lastMarket,
          [action.payload.symbol]: action.payload.lastMarket,
        },
      }
    case SET_SELECTED_COIN:
      return {
        ...state,
        selectedCoin: action.payload.coin,
      }

    default:
      return state
  }
}
