import LHTProxyDAO from '../../dao/LHTProxyDAO'
import UserDAO from '../../dao/UserDAO'

import {
  setTotalLHTBalanceStart,
  setTotalLHTBalanceSuccess,
  setTotalMembersBalanceStart,
  setTotalMembersBalanceSuccess
} from './reducer'

const updateTotalLHT = () => (dispatch) => {
  dispatch(setTotalLHTBalanceStart())
  LHTProxyDAO.totalSupply()
    .then(balance => {
      dispatch(setTotalLHTBalanceSuccess(balance))
    })
}

const updateTotalMembers = () => (dispatch) => {
  dispatch(setTotalMembersBalanceStart())
  UserDAO.countIUsers()
    .then(balance => {
      // substract owner
      dispatch(setTotalMembersBalanceSuccess(balance-1))
    })
}

export {
  updateTotalLHT,
  updateTotalMembers
}
