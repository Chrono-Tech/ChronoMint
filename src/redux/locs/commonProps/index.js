export const LOCS_FETCH_START = 'locs/FETCH_START'
export const LOCS_FETCH_END = 'locs/FETCH_END'

const initialState = {
  isFetching: false,
  error: false,
  isFetched: false
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case LOCS_FETCH_START:
      return {
        ...state,
        isFetching: true
      }
    case LOCS_FETCH_END:
      return {
        ...state,
        isFetching: false,
        isFetched: true
      }
    default:
      return state
  }
}

export default reducer
