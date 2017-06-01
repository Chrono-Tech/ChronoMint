import { Map } from 'immutable'
import * as actions from './actions'
const initialState = {
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
        locs: state.locs.set(action.loc.id(), action.loc)
      }
    case actions.LOC_UPDATE:
      return {
        ...state,
        locs: state.locs.set(action.loc.id(), action.loc)
      }
    // case actions.LOC_CREATE:
    //   return {
    //     ...state,
    //     locs: state.locs.set(action.data.address, action.data)}
    case actions.LOC_REMOVE:
      return {
        ...state,
        locs: state.locs.delete(action.data.address)
      }
    // case actions.LOC_UPDATE:
    //   return {
    //     ...state,
    //     locs: state.locs.setIn([action.data.address, action.data.valueName], action.data.value)
    //   }
    // case actions.LOC_TRANSACTION:
    //   return {
    //     ...state,
    //     locs: state.locs.set(action.loc.id(), action.loc)
    //   }
    case actions.LOCS_UPDATE_FILTER:
      return {
        ...state,
        filter: action.filter
      }

    case actions.LOCS_COUNTER:
      return {
        ...state,
        counter: action.payload
      }
    default:
      return state
  }
}
