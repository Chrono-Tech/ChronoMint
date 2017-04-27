import LHTProxyDAO from '../../dao/LHTProxyDAO'
import UserStorageDAO from '../../dao/UserStorageDAO'

import {
  DASHBOARD_TOTAL_LHT_FETCH,
  DASHBOARD_TOTAL_LHT,
  DASHBOARD_TOTAL_MEMBERS_FETCH,
  DASHBOARD_TOTAL_MEMBERS
} from './reducer'

export const updateTotalLHT = () => (dispatch) => {
  dispatch({type: DASHBOARD_TOTAL_LHT_FETCH})
  return LHTProxyDAO.totalSupply()
    .then(balance => {
      dispatch({type: DASHBOARD_TOTAL_LHT, payload: balance})
    })
}

export const updateTotalMembers = () => (dispatch) => {
  dispatch({type: DASHBOARD_TOTAL_MEMBERS_FETCH})
  return UserStorageDAO.usersTotal()
    .then(number => {
      dispatch({type: DASHBOARD_TOTAL_MEMBERS, payload: number})
    })
}
