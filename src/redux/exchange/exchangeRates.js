import { List } from 'immutable'
import ExchangeDAO from '../../dao/ExchangeDAO'
import converter from '../../utils/converter'
import AssetModel from '../../models/AssetModel'

export const EXCHANGE_RATES_LOAD_START = 'exchange/RATES_LOAD_START'
export const EXCHANGE_RATES_LOAD_SUCCESS = 'exchange/RATES_LOAD_SUCCESS'

const initialState = {
  rates: new List(),
  isFetching: false,
  isFetched: false
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case EXCHANGE_RATES_LOAD_START:
      return {
        ...state,
        isFetching: true
      }
    case EXCHANGE_RATES_LOAD_SUCCESS:
      return {
        isFetching: false,
        isFetched: true,
        rates: state.rates.push(action.rates)
      }
    default:
      return state
  }
}

export const getRates = () => (dispatch) => {
  dispatch({type: EXCHANGE_RATES_LOAD_START})
  Promise.all([
    ExchangeDAO.getBuyPrice(),
    ExchangeDAO.getSellPrice()
  ]).then(([buyPrice, sellPrice]) => {
    dispatch({
      type: EXCHANGE_RATES_LOAD_SUCCESS,
      rates: new AssetModel({
        title: 'LHT',
        buyPrice: converter.fromWei(buyPrice.toNumber()),
        sellPrice: converter.fromWei(sellPrice.toNumber())
      })
    })
  })
}

export default reducer
