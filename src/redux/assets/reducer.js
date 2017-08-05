import Immutable from 'immutable'
import * as a from './actions'

const initialState = {
  list: new Immutable.Map(),
  isFetched: false
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case a.ASSETS_LIST:
      return {
        ...state,
        list: action.list,
        isFetched: true
      }
    default:
      return state
  }
}

export default reducer
