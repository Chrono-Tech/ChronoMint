import {SESSION_CREATE_FETCH} from '../session/actions'

export const CONFIRMATIONS_LOAD_START = 'confirmations/LOAD_START'
export const CONFIRMATIONS_LOAD_SUCCESS = 'confirmations/LOAD_SUCCESS'

const initialState = {
  isFetching: false,
  error: false,
  isReady: false
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case SESSION_CREATE_FETCH:
      return initialState
    case CONFIRMATIONS_LOAD_START:
      return {
        ...state,
        isFetching: true,
        isReady: false
      }
    case CONFIRMATIONS_LOAD_SUCCESS:
      return {
        ...state,
        isFetching: false,
        isReady: true
      }
    default:
      return state
  }
}

export default reducer
