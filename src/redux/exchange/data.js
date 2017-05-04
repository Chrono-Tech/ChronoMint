import ExchangeDAO from '../../dao/ExchangeDAO'
import converter from '../../utils/converter'
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
      buyPrice: converter.fromWei(values[0].toNumber()),
      sellPrice: converter.fromWei(values[1].toNumber())
    }))
  })
}
