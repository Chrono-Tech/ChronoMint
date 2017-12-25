import TokensCollection from 'models/tokens/TokensCollection'
import * as a from './actions'

const initialState = new TokensCollection()

export default (state = initialState, action) => {
  switch (action.type) {
    case a.TOKENS_INIT:
      return state.isInited(action.isInited)
    case a.TOKENS_FETCHING:
      return state.leftToFetch(action.count)
    case a.TOKENS_FAILED:
      return state.leftToFetch(state.leftToFetch() - 1)
    case a.TOKENS_FETCHED:
      return state.itemFetched(action.token)
    case a.TOKENS_REMOVE:
      return state.remove(action.token)
    // TODO @dkchv: useless?
    case a.TOKENS_UPDATE:
      return state.update(action.token)
    default:
      return state
  }
}
