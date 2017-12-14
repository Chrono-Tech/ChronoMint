import TokensCollection from 'models/tokens/TokensCollection'
import * as a from './actions'

const initialState = new TokensCollection()

export default (state = initialState, action) => {
  switch (action.type) {
    case a.TOKENS_INIT:
      return state.isInited(action.isInited)
    case a.TOKENS_FETCHING:
      return state.isFetching(true)
    case a.TOKENS_FETCHED:
      return state.isFetched(true).isFetching(false)
    case a.TOKENS_REMOVE:
      return state.remove(action.token)
    // TODO @dkchv: useless?
    case a.TOKENS_UPDATE:
      return state.update(action.token)
    default:
      return state
  }
}
