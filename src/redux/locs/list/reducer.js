import { Map } from 'immutable'

const LOCS_LIST = 'loc/CREATE_ALL'
const LOC_CREATE = 'loc/CREATE'
const LOC_UPDATE = 'loc/UPDATE'
const LOC_REMOVE = 'loc/REMOVE'

const initialState = new Map([])

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case LOCS_LIST:
      return action.data
    case LOC_CREATE:
      return state.set(action.data.address, action.data)
    case LOC_REMOVE:
      return state.delete(action.data.address)
    case LOC_UPDATE:
      return state.setIn([action.data.address, action.data.valueName], action.data.value)
    default:
      return state
  }
}

export {
  LOCS_LIST,
  LOC_CREATE,
  LOC_UPDATE,
  LOC_REMOVE
}

export default reducer
