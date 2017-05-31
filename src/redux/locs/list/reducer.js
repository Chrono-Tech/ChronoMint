import { Map } from 'immutable'
import * as actions from './actions'
const initialState = {
  locs: new Map([]),
  filter: '',
  isFetching: false,
  isFetched: false
}

export default (state = initialState, action) => {
  switch (action.type) {
    case actions.LOCS_FETCH_START:
      return {
        ...state,
        isFetching: true
      }
    case actions.LOCS_LIST:
      return {
        ...state,
        locs: state.locs.merge(action.data),
        isFetched: true,
        isFetching: false
      }
    case actions.LOC_CREATE:
      return {
        ...state,
        locs: state.locs.set(action.data.address, action.data)}
    case actions.LOC_REMOVE:
      return {
        ...state,
        locs: state.locs.delete(action.data.address)
      }
    case actions.LOC_UPDATE:
      return {
        ...state,
        locs: state.locs.setIn([action.data.address, action.data.valueName], action.data.value)
      }
    case actions.LOCS_UPDATE_FILTER:
      return {
        ...state,
        filter: action.filter
      }
    default:
      return state
  }
}
