import Immutable from 'immutable'

export const POLLS_LOAD = 'voting/POLLS_LOAD'
export const POLLS_LIST = 'voting/POLLS_LIST'
export const POLLS_CREATE = 'voting/POLLS_CREATE'
export const POLLS_UPDATE = 'voting/POLLS_UPDATE'

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
    case POLLS_UPDATE:
      return {
        ...state,
        list: state.list.set(action.data.poll.index(), action.data.poll)
      }
    default:
      return state
  }
}
