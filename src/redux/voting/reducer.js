import VotingMainModel from 'models/voting/VotingMainModel'
import {
  POLLS_CREATE, POLLS_LIST, POLLS_LOAD, POLLS_REMOVE, POLLS_REMOVE_STUB, POLLS_UPDATE, POLLS_VOTE_LIMIT,
  VOTING_POLLS_COUNT,
} from './actions'

const initialState = new VotingMainModel()

export default (state = initialState, action) => {
  switch (action.type) {
    case POLLS_VOTE_LIMIT:
      return state.voteLimitInTIME(action.voteLimitInTIME)
    case POLLS_LOAD:
      return state.isFetching(true)
    case POLLS_LIST:
      return state
        .isFetching(false)
        .isFetched(true)
        .list(action.list)
    case POLLS_CREATE:
      return state
        .list(state.list().set(action.poll.poll().id(), action.poll))
        .pollsCount(state.pollsCount().plus(1))
    case POLLS_REMOVE_STUB:
      return state
        .list(
          state.list()
            .filter((poll) => {
              const hash = poll.transactionHash()
              return hash === null || hash !== action.transactionHash
            }),
        )
    case POLLS_UPDATE:
      return state
        .list(state.list().set(action.poll.poll().id(), action.poll))
        .activePollsCount(action.activeCount || state.activePollsCount())
    case POLLS_REMOVE:
      return state
        .list(state.list().delete(action.id))
    case VOTING_POLLS_COUNT:
      return state
        .pollsCount(action.count || state.pollsCount())
        .activePollsCount(action.activeCount || state.activePollsCount())
    default:
      return state
  }
}
