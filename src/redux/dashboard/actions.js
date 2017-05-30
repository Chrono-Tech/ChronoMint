import DAORegistry from '../../dao/DAORegistry'

export const DASHBOARD_TOTAL_LHT_FETCH = 'dashboard/TOTAL_LHT_FETCH'
export const DASHBOARD_TOTAL_LHT = 'dashboard/TOTAL_LHT'
export const DASHBOARD_TOTAL_MEMBERS_FETCH = 'dashboard/TOTAL_MEMBERS_FETCH'
export const DASHBOARD_TOTAL_MEMBERS = 'dashboard/TOTAL_MEMBERS'

export const updateTotalLHT = () => (dispatch) => {
  dispatch({type: DASHBOARD_TOTAL_LHT, payload: 'TODO'}) // TODO
}

export const updateTotalMembers = () => async (dispatch) => {
  dispatch({type: DASHBOARD_TOTAL_MEMBERS_FETCH})
  const dao = await DAORegistry.getUserManagerDAO()
  return dao.usersTotal()
    .then(number => {
      dispatch({type: DASHBOARD_TOTAL_MEMBERS, payload: number})
    })
}
