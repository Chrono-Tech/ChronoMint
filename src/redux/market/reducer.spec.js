/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import * as a from './action'
import reducer from './reducer'

describe('Market reducer', () => {
  it('should return initial state', () => {
    expect(reducer(undefined, {})).toEqual({
      currencies: ['USD'],
      isInited: false,
      lastMarket: {},
      prices: {},
      rates: {},
      selectedCoin: 'ETH',
      selectedCurrency: 'USD',
      tokens: ['ETH', 'TIME'],
    })
  })

  it('should handle MARKET_INIT', () => {
    expect(reducer({}, { type: a.MARKET_INIT, isInited: true }))
      .toEqual({
        isInited: true,
      })
  })

  it('should handle MARKET_INIT', () => {
    const initState = {
      tokens: ['FIRST'],
    }
    expect(reducer(initState, { type: a.MARKET_ADD_TOKEN, symbol: 'SECOND' }))
      .toEqual({
        tokens: ['FIRST', 'SECOND'],
      })
  })

  it('should handle MARKET_UPDATE_PRICES', () => {
    const initState = {
      prices: {
        FAKE: {
          USD: 5,
        },
      },
    }

    const newPrices = {
      FAKE: {
        USD: 55,
      },
    }

    expect(reducer(initState, { type: a.MARKET_UPDATE_PRICES, prices: newPrices }))
      .toEqual({
        prices: newPrices,
      })
  })
})
