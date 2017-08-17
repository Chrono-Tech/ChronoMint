import reducer from './reducer'
import * as a from './action'

describe('Market reducer', () => {
  it('should return initial state', () => {
    expect(reducer(undefined, {})).toEqual({
      isInited: false,
      tokens: ['ETH', 'TIME'],
      currencies: ['USD'],
      prices: {},
      selectedCurrency: 'USD'
    })
  })

  it('should handle MARKET_INIT', () => {
    expect(reducer({}, {type: a.MARKET_INIT, isInited: true}))
      .toEqual({
        isInited: true
      })
  })

  it('should handle MARKET_INIT', () => {
    const initState = {
      tokens: ['FIRST']
    }
    expect(reducer(initState, {type: a.MARKET_ADD_TOKEN, symbol: 'SECOND'}))
      .toEqual({
        tokens: ['FIRST', 'SECOND']
      })
  })

  it('should handle MARKET_UPDATE_PRICES', () => {
    const initState = {
      prices: {
        FAKE: {
          USD: 5
        }
      }
    }

    const newPrices = {
      FAKE: {
        USD: 55
      }
    }

    expect(reducer(initState, {type: a.MARKET_UPDATE_PRICES, prices: newPrices}))
      .toEqual({
        prices: newPrices
      })
  })
})
