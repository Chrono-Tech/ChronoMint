import Immutable from 'immutable'
import TokenModel from 'models/TokenModel'
import * as a from './actions'

const initialState = {
  list: new Immutable.Map(),
  selected: new TokenModel(),
  formFetching: false,
  isFetched: false,
}

export default (state = initialState, action) => {
  switch (action.type) {
    case a.TOKENS_LIST:
      return {
        ...state,
        list: action.list,
        isFetched: true,
      }
    case a.TOKENS_FORM:
      return {
        ...state,
        selected: action.token,
      }
    case a.TOKENS_FORM_FETCH:
      return {
        ...state,
        formFetching: !(action.end || false),
      }
    case a.TOKENS_SET:
      return {
        ...state,
        list: state.list.set(action.token.id(), action.token),
      }
    case a.TOKENS_REMOVE:
      return {
        ...state,
        list: state.list.delete(action.token.id()),
      }
    default:
      return state
  }
}
