import VotingModel from 'models/voting/VotingCollection'
import * as a from './actions'

const initialState = new VotingModel()

export default (state = initialState, action) => {
  switch (action.type) {
    case a.POLLS_INIT:
      return state.isInited(action.isInited)
    case a.POLLS_VOTE_LIMIT:
      return state.voteLimitInTIME(action.voteLimitInTIME)
    case a.POLLS_LOAD:
      return state.isFetching(true)
    case a.POLLS_LIST:
      return state
        .isFetched(true)
        .isFetching(false)
        .list(action.list)
    case a.POLLS_CREATE:
      return state.list(state.list().set(
        action.poll.poll().id(),
        action.poll
      ))
    case a.POLLS_REMOVE_STUB:
      return state.list(state.list().filter((poll) => {
        const hash = poll.transactionHash()
        return hash === null || hash !== action.transactionHash
      }))
    case a.POLLS_UPDATE:
      return state.list(state.list().set(
        action.poll.poll().id(),
        action.poll
      ))
    case a.POLLS_REMOVE:
      return state.remove(action.item)
    default:
      return state
  }
}
