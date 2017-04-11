import LHTProxyDAO from '../../dao/LHTProxyDAO'
import UserDAO from '../../dao/UserDAO'

import {
  DASHBOARD_TOTAL_LHT_FETCH,
  DASHBOARD_TOTAL_LHT,
  DASHBOARD_TOTAL_MEMBERS_FETCH,
  DASHBOARD_TOTAL_MEMBERS
} from './reducer'

const updateTotalLHT = () => (dispatch) => {
  dispatch({type: DASHBOARD_TOTAL_LHT_FETCH})
  return LHTProxyDAO.totalSupply()
    .then(balance => {
      dispatch({type: DASHBOARD_TOTAL_LHT, payload: balance})
    })
}

const updateTotalMembers = () => (dispatch) => {
  dispatch({type: DASHBOARD_TOTAL_MEMBERS_FETCH})
  return UserDAO.countUsers()
    .then(number => {
      dispatch({type: DASHBOARD_TOTAL_MEMBERS, payload: number})
    })
}

export {
  updateTotalLHT,
  updateTotalMembers
}
