
const SET_TOTAL_LHT_BALANCE_START = 'dashboard/SET_LHT_BALANCE_START'
const SET_TOTAL_LHT_BALANCE_SUCCESS = 'dashboard/SET_LHT_BALANCE_SUCCESS'

const initialState = {
  totalLHT: {
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
    default:
      return state
  }
}

const setTotalLHTBalanceStart = () => ({type: SET_TOTAL_LHT_BALANCE_START})
const setTotalLHTBalanceSuccess = (payload) => ({type: SET_TOTAL_LHT_BALANCE_SUCCESS, payload})

export default reducer

export {
  setTotalLHTBalanceStart,
  setTotalLHTBalanceSuccess
}
