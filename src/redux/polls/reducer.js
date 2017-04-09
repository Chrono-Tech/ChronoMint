import PollModel from '../../models/PollModel'
import {Map} from 'immutable'

const POLL_CREATE = 'poll/CREATE'
const POLL_UPDATE = 'poll/UPDATE'
// const POLL_REMOVE = 'poll/REMOVE';

// const removePollAction = (data) => ({type: POLL_REMOVE, data});

const initialState = new Map([])

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case POLL_CREATE:
      return state.set(action.data.index, new PollModel(action.data))
    case POLL_UPDATE:
      return state.setIn([action.data.index, action.data.valueName], action.data.value)
    // case POLL_REMOVE:
    //     return state.delete(action.data.address);
    default:
      return state
  }
}

export {
  POLL_CREATE,
  POLL_UPDATE
  // removePollAction
}

export default reducer
