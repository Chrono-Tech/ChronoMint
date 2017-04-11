export const LOCS_COUNTER = 'loc/COUNTER'

const reducer = (state = 0, action) => {
  switch (action.type) {
    case LOCS_COUNTER:
      return action.payload
    default:
      return state
  }
}

export default reducer
