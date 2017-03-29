import {Map} from 'immutable'

const LOC_CREATE_ALL = 'loc/CREATE_ALL'
const LOC_CREATE = 'loc/CREATE'
const LOC_UPDATE = 'loc/UPDATE'
const LOC_REMOVE = 'loc/REMOVE'

const createAllLOCsAction = (data) => ({type: LOC_CREATE_ALL, data})
const createLOCAction = (data) => ({type: LOC_CREATE, data})
const updateLOCAction = (data) => ({type: LOC_UPDATE, data})
const removeLOCAction = (data) => ({type: LOC_REMOVE, data})

const initialState = new Map([])

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case LOC_CREATE_ALL:
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
  createAllLOCsAction,
  createLOCAction,
  updateLOCAction,
  removeLOCAction
}

export default reducer
