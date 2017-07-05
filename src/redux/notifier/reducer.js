import Immutable from 'immutable'
import * as a from './actions'

const initialState = {
  notice: null,
  list: new Immutable.List()
}

export default (state = initialState, action) => {
  switch (action.type) {
    case a.NOTIFIER_MESSAGE:
      return {
        ...state,
        notice: action.notice,
        list: action.isStorable ? state.list.push(action.notice) : state.list
      }
    case a.NOTIFIER_CLOSE:
      return {
        ...state,
        notice: null
      }
    default:
      return state
  }
}
