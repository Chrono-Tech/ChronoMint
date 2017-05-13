import { Map } from 'immutable'
import * as a from './actions'

const initialState = {
  list: new Map(),
  isFetching: false,
  isFetched: false,
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
        list: state.isFetched ? state.list.merge(action.list) : action.list,
        isFetching: false,
        isFetched: true,
        toBlock: action.fromBlock - 1
      }
    case a.OPERATIONS_UPDATE:
      return {
        ...state,
        list: !action.operation.isDone() && (action.operation.isCancelled() || action.operation.isCompleted())
          ? state.list.delete(action.operation.id())
          : state.list.set(action.operation.id(), action.operation)
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
