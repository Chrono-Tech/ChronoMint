import Immutable from 'immutable'

import PollDetailsModel from 'models/PollDetailsModel'

export const POLLS_LOAD = 'voting/POLLS_LOAD'
export const POLLS_LIST = 'voting/POLLS_LIST'
export const POLLS_CREATE = 'voting/POLLS_CREATE'
export const POLLS_REMOVE = 'voting/POLLS_REMOVE'

const initialState = {
  list: new Immutable.Map(),
  isFetching: false,
  isFetched: false
}

export default (state = initialState, action) => {
  switch (action.type) {
    case POLLS_LOAD:
      return {
        ...state,
        isFetching: true
      }
    case POLLS_LIST:
      return {
        ...state,
        isFetching: false,
        isFetched: true,
        list: new Immutable.Map(action.list)
      }
    case POLLS_CREATE:
      return {
        ...state,
        list: state.list.set(
          action.data.poll.index(),
          new PollDetailsModel({
            poll: action.data.poll
          })
        )
      }
    case POLLS_REMOVE:
      return {
        ...state,
        list: state.list.delete(
          action.data.poll.index()
        )
      }
    default:
      return state
  }
}
