import { Map } from 'immutable'
import * as actions from './actions'

export const initialState = {
  locs: new Map({}),
  filter: '',
  isFetching: false,
  isFetched: false,
  counter: 0
}

export default (state = initialState, action) => {
  switch (action.type) {
    // loc list
    case actions.LOCS_LIST_FETCH:
      return {
        ...state,
        isFetching: true
      }
    case actions.LOCS_LIST:
      return {
        ...state,
        locs: state.locs.merge(action.locs),
        isFetched: true,
        isFetching: false
      }
    // loc CRUD
    case actions.LOC_CREATE:
      return {
        ...state,
        locs: state.locs.set(action.loc.name(), action.loc)
      }
    case actions.LOC_UPDATE:
      return {
        ...state,
        locs: state.locs.set(action.loc.name(), action.loc)
      }
    case actions.LOC_REMOVE:
      return {
        ...state,
        locs: state.locs.delete(action.name)
      }
    // others
    case actions.LOCS_UPDATE_FILTER:
      return {
        ...state,
        filter: action.filter
      }
    case actions.LOCS_COUNTER:
      return {
        ...state,
        counter: action.counter
      }
    default:
      return state
  }
}
