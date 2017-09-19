import * as actions from './action'

export const initialState = {
  isInited: false,
  tokens: ['ETH', 'TIME'],
  currencies: ['USD'],
  prices: {},
  rates: {},
  selectedCurrency: 'USD',
  lastMarket: {},
  selectedCoin: null
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
      return {
        ...state,
        rates: {
          ...state.rates,
          [action.payload.pair]: {
            ...(state.rates[action.payload.pair] || {}),
            [action.payload.LASTMARKET]: {
              ...action.payload
            }
          }
        }
      }
    case actions.LAST_MARKET_UPDATE:
      return {
        ...state,
        lastMarket: {
          ...state.lastMarket,
          [action.payload.pair]: action.payload.lastMarket
        }
      }
    case actions.SET_SELECTED_COIN:
      return {
        ...state,
        selectedCoin: action.payload.coin
      }

    default:
      return state
  }
}
