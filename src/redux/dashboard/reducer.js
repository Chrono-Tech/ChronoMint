
export const DASHBOARD_TOTAL_LHT_FETCH = 'dashboard/TOTAL_LHT_FETCH'
export const DASHBOARD_TOTAL_LHT = 'dashboard/TOTAL_LHT'

export const DASHBOARD_TOTAL_MEMBERS_FETCH = 'dashboard/TOTAL_MEMBERS_FETCH'
export const DASHBOARD_TOTAL_MEMBERS = 'dashboard/TOTAL_MEMBERS'

const initialState = {
  totalLHT: {
    balance: null,
    isFetching: true
  },
  totalMembers: {
    number: null,
    isFetching: true
  }
}

export default (state = initialState, action) => {
  switch (action.type) {
    case DASHBOARD_TOTAL_LHT_FETCH:
      return {
        ...state,
        totalLHT: {
          ...state.totalLHT,
          isFetching: true
        }
      }
    case DASHBOARD_TOTAL_LHT:
      return {
        ...state,
        totalLHT: {
          isFetching: false,
          balance: action.payload
        }
      }
    case DASHBOARD_TOTAL_MEMBERS_FETCH:
      return {
        ...state,
        totalMembers: {
          ...state.totalMembers,
          isFetching: true
        }
      }
    case DASHBOARD_TOTAL_MEMBERS:
      return {
        ...state,
        totalMembers: {
          isFetching: false,
          number: action.payload
        }
      }
    default:
      return state
  }
}
