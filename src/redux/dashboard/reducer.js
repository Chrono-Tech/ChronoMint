import * as actions from './actions'

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
    case actions.DASHBOARD_TOTAL_LHT_FETCH:
      return {
        ...state,
        totalLHT: {
          ...state.totalLHT,
          isFetching: true
        }
      }
    case actions.DASHBOARD_TOTAL_LHT:
      return {
        ...state,
        totalLHT: {
          isFetching: false,
          balance: action.payload
        }
      }
    case actions.DASHBOARD_TOTAL_MEMBERS_FETCH:
      return {
        ...state,
        totalMembers: {
          ...state.totalMembers,
          isFetching: true
        }
      }
    case actions.DASHBOARD_TOTAL_MEMBERS:
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
