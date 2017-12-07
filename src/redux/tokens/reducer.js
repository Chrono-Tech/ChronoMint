import TokensCollection from 'models/tokens/TokensCollection'
import * as a from './actions'

const initialState = new TokensCollection()

export default (state = initialState, action) => {
  switch (action.type) {
    case a.TOKENS_INIT:
      return state.isInited(action.isInited)
    case a.TOKENS_UPDATE:
      return action.tokens
        ? state.merge(action.tokens)
        : state.update(action.token)
    default:
      return state
  }
}
