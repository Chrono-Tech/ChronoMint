import * as actions from './action'

export const initialState = {
  isInited: false,
  tokens: ['ETH', 'TIME'],
  currencies: ['USD'],
  prices: {},
  rates: {},
  selectedCurrency: 'USD'
}

export default (state = initialState, action) => {
  switch (action.type) {
    case actions.MARKET_INIT:
      return {
        ...state,
        isInited: action.isInited
      }
    case actions.MARKET_ADD_TOKEN:
      return {
        ...state,
        tokens: [...state.tokens, action.symbol]
      }
    case actions.MARKET_UPDATE_PRICES:
      return {
        ...state,
        prices: action.prices
      }
    case actions.MARKET_UPDATE_RATES:
      // eslint-disable-next-line
      console.log(actions.MARKET_UPDATE_RATES)
      return {
        ...state,
        rates: {
          ...state.rates,
          [action.payload.MARKET]: {
            ...state.rates[action.payload.MARKET],
            [action.payload.pair]: action.payload
          }
        }
      }

    default:
      return state
  }
}
