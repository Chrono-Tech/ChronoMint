import VotingMainModel from 'models/voting/VotingMainModel'
import {
  POLLS_CREATE, POLLS_LIST, POLLS_LOAD, POLLS_REMOVE, POLLS_UPDATE, POLLS_VOTE_LIMIT,
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
        .list(state.list().update(action.poll))
    case POLLS_UPDATE:
      return state
        .list(state.list().update(action.poll))
    case POLLS_REMOVE:
      return state
        .list(state.list().remove(action.id))
    default:
      return state
  }
}
