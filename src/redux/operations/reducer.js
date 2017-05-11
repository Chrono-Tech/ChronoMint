import { Map } from 'immutable'
import * as a from './actions'

const initialState = {
  list: new Map(),
  isFetching: false,
  isReady: false,
  toBlock: null,
  required: null
}

export default (state = initialState, action) => {
  switch (action.type) {
    case a.OPERATIONS_FETCH:
      return {
        ...state,
        isFetching: true
      }
    case a.OPERATIONS_LIST:
      return {
        ...state,
        list: state.list.merge(action.list),
        isFetching: false,
        isReady: true,
        toBlock: action.fromBlock - 1
      }
    case a.OPERATIONS_UPDATE:
      return {
        ...state,
        list: state.list.set(action.operation.id(), action.operation)
      }
    case a.OPERATIONS_SIGNS_REQUIRED:
      return {
        ...state,
        required: action.required
      }
    default:
      return state
  }
}
