import Immutable from 'immutable'
import * as a from './actions'

const initialState = {
  pendingTxs: new Immutable.Map()
}

export default (state = initialState, action) => {
  switch (action.type) {
    case a.WATCHER_TX_START:
      return {
        ...state,
        pendingTxs: state.pendingTxs.set(action.tx.id(), action.tx)
      }
    case a.WATCHER_TX_END:
      return {
        ...state,
        pendingTxs: state.pendingTxs.remove(action.tx.id())
      }
    default:
      return state
  }
}
