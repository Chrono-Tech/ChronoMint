import ExchangeDAO from '../../dao/ExchangeDAO'
import { weiToEther } from '../../utils/converter'

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
      buyPrice: weiToEther(values[0].toNumber()),
      sellPrice: weiToEther(values[1].toNumber())
    }))
  })
}
