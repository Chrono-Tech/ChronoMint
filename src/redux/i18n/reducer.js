import TokensCollection from 'models/tokens/TokensCollection'
import * as a from './actions'
import {I18N_LOADED} from "./actions";

const initialState = new TokensCollection()

export default (state = initialState, action) => {
  switch (action.type) {
    case a.LOAD_INIT:
      return state.isInited(action.isInited)
    case a.I18N_LOADED:
      return {...state, list: action.payload.list}
    default:
      return state
  }
}
