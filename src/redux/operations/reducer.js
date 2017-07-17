import { Map } from 'immutable'
import * as a from './actions'

const initialState = {
  list: new Map(),
  isFetching: false,
  isFetched: false,
  completedEndOfList: false,
  required: null,
  adminCount: null
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
        completedEndOfList: action.list.size === 0
      }
    case a.OPERATIONS_SET:
      return {
        ...state,
        list: !action.operation.isDone() && (action.operation.isCancelled() || action.operation.isCompleted())
          ? state.list.delete(action.operation.originId())
          : state.list.set(action.operation.originId(), action.operation)
      }
    case a.OPERATIONS_SIGNS_REQUIRED:
      return {
        ...state,
        required: action.required
      }
    case a.OPERATIONS_ADMIN_COUNT:
      return {
        ...state,
        adminCount: action.adminCount
      }
    default:
      return state
  }
}
