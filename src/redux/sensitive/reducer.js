import * as a from './actions'

const initialState = {
  isSaveKey: true
}

export default (state = initialState, action) => {
  switch (action.type) {
    case a.SENSITIVE_SET_SAVE_KEY:
      return {
        ...state,
        isSaveKey: action.isSaveKey
      }
    default:
      return state
  }
}
