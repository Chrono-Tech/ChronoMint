import LHTProxyDAO from '../../dao/LHTProxyDAO'

import {
  setTotalLHTBalanceStart,
  setTotalLHTBalanceSuccess
} from './reducer'

const updateTotalLHT = () => (dispatch) => {
  dispatch(setTotalLHTBalanceStart())
  LHTProxyDAO.totalSupply()
    .then(balance => {
      dispatch(setTotalLHTBalanceSuccess(balance))
    })
}

export {
  updateTotalLHT
}
