import ExchangeDAO from '../../dao/ExchangeDAO'

import {
  setRatesStart,
  setRatesSuccess
} from './reducer'

export const getRates = () => (dispatch) => {
  dispatch(setRatesStart())
  Promise.all([
    ExchangeDAO.getBuyPrice(),
    ExchangeDAO.getSellPrice()
  ]).then(values => {
    dispatch(setRatesSuccess({
      title: 'LHT',
      buyPrice: ExchangeDAO.fromWei(values[0].toNumber()),
      sellPrice: ExchangeDAO.fromWei(values[1].toNumber())
    }))
  })
}
