import { Map } from 'immutable'
import * as a from './actions'

const initialState = {
  list: new Map(),
  isFetching: false,
  isReady: false,
  toBlock: null
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
      const operation = action.isRevoked === null
        ? action.operation
        : state.list.get(action.operation.id())[action.isRevoked ? 'revoked' : 'confirmed']()
      return {
        ...state,
        list: state.list.set(action.operation.id(), operation)
      }
    default:
      return state
  }
}
