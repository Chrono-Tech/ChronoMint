import Immutable from 'immutable'
import CBEModel from 'models/CBEModel'
import * as a from './actions'

const initialState = {
  list: new Immutable.Map(),
  selected: new CBEModel(),
  isFetched: false,
  isFetching: false
}

export default (state = initialState, action) => {
  switch (action.type) {
    case a.CBE_LIST:
      return {
        ...state,
        list: action.list,
        isFetching: false,
        isFetched: true
      }
    case a.CBE_FORM:
      return {
        ...state,
        selected: action.cbe
      }
    case a.CBE_SET:
      return {
        ...state,
        list: state.list.set(action.cbe.address(), action.cbe)
      }
    case a.CBE_REMOVE:
      return {
        ...state,
        list: state.list.delete(action.cbe.address())
      }
    case a.CBE_LIST_FETCH:
      return {
        ...state,
        isFetching: true
      }
    default:
      return state
  }
}
