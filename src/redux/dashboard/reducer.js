
const SET_TOTAL_LHT_BALANCE_START = 'dashboard/SET_TOTAL_LHT_BALANCE_START'
const SET_TOTAL_LHT_BALANCE_SUCCESS = 'dashboard/SET_TOTAL_LHT_BALANCE_SUCCESS'

const SET_TOTAL_MEMBERS_BALANCE_START = 'dashboard/SET_TOTAL_MEMBERS_BALANCE_START'
const SET_TOTAL_MEMBERS_BALANCE_SUCCESS = 'dashboard/SET_TOTAL_MEMBERS_BALANCE_SUCCESS'

const initialState = {
  totalLHT: {
    balance: null,
    isFetching: true
  },
  totalMembers: {
    balance: null,
    isFetching: true
  }
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_TOTAL_LHT_BALANCE_START:
      return {
        ...state,
        totalLHT: {
          ...state.totalLHT,
          isFetching: true
        }
      }
    case SET_TOTAL_LHT_BALANCE_SUCCESS:
      return {
        ...state,
        totalLHT: {
          isFetching: false,
          balance: action.payload
        }
      }
    case SET_TOTAL_MEMBERS_BALANCE_START:
      return {
        ...state,
        totalMembers: {
          ...state.totalMembers,
          isFetching: true
        }
      }
    case SET_TOTAL_MEMBERS_BALANCE_SUCCESS:
      return {
        ...state,
        totalMembers: {
          isFetching: false,
          balance: action.payload
        }
      }
    default:
      return state
  }
}

const setTotalLHTBalanceStart = () => ({type: SET_TOTAL_LHT_BALANCE_START})
const setTotalLHTBalanceSuccess = (payload) => ({type: SET_TOTAL_LHT_BALANCE_SUCCESS, payload})

const setTotalMembersBalanceStart = () => ({type: SET_TOTAL_MEMBERS_BALANCE_START})
const setTotalMembersBalanceSuccess = (payload) => ({type: SET_TOTAL_MEMBERS_BALANCE_SUCCESS, payload})

export default reducer

export {
  setTotalLHTBalanceStart,
  setTotalLHTBalanceSuccess,
  setTotalMembersBalanceStart,
  setTotalMembersBalanceSuccess
}
