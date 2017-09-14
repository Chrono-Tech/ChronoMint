import { USER_ACTIVE } from './monitorService'

export default (state = {}, action) => {
  switch (action.type) {
    case USER_ACTIVE:
      return {
        ...state,
        active: action.payload.active
      }

    default:
      return state
  }
}
