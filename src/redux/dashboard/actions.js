import LHTProxyDAO from '../../dao/LHTProxyDAO'
import UserDAO from '../../dao/UserDAO'

export const DASHBOARD_TOTAL_LHT_FETCH = 'dashboard/TOTAL_LHT_FETCH'
export const DASHBOARD_TOTAL_LHT = 'dashboard/TOTAL_LHT'
export const DASHBOARD_TOTAL_MEMBERS_FETCH = 'dashboard/TOTAL_MEMBERS_FETCH'
export const DASHBOARD_TOTAL_MEMBERS = 'dashboard/TOTAL_MEMBERS'

export const updateTotalLHT = () => (dispatch) => {
  dispatch({type: DASHBOARD_TOTAL_LHT_FETCH})
  return LHTProxyDAO.totalSupply()
    .then(balance => {
      dispatch({type: DASHBOARD_TOTAL_LHT, payload: balance})
    })
}

export const updateTotalMembers = () => (dispatch) => {
  dispatch({type: DASHBOARD_TOTAL_MEMBERS_FETCH})
  return UserDAO.usersTotal()
    .then(number => {
      dispatch({type: DASHBOARD_TOTAL_MEMBERS, payload: number})
    })
}
