import {Map} from 'immutable'

const POLL_CREATE = 'poll/CREATE'
const POLL_UPDATE = 'poll/UPDATE'

const initialState = new Map([])

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case POLL_CREATE:
      return state.set(action.data.index, action.data.poll)
    case POLL_UPDATE:
      return state.setIn([action.data.index, action.data.valueName], action.data.value)
    default:
      return state
  }
}

export {
  POLL_CREATE,
  POLL_UPDATE
}

export default reducer
