import * as actions from './actions'

const initialState = {
  isOpen: false,
}

export default (state = initialState, action) => {
  switch (action.type) {
    case actions.DRAWER_TOGGLE:
      return {
        ...action.payload,
        isOpen: !state.isOpen,
      }
    case actions.DRAWER_HIDE:
      return {
        ...action.payload,
        isOpen: false,
      }
    default:
      return state
  }
}
