import {SESSION_CREATE_START} from '../session/actions'

const PENDINGS_LOAD_START = 'pendings/LOAD_START'
const PENDINGS_LOAD_SUCCESS = 'pendings/LOAD_SUCCESS'

export const pendingsLoadStartAction = () => ({type: PENDINGS_LOAD_START})
export const pendingsLoadSuccessAction = () => ({type: PENDINGS_LOAD_SUCCESS})

const initialState = {
  isFetching: false,
  error: false,
  isReady: false
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case SESSION_CREATE_START:
      return initialState
    case PENDINGS_LOAD_START:
      return {
        ...state,
        isFetching: true,
        isReady: false
      }
    case PENDINGS_LOAD_SUCCESS:
      return {
        ...state,
        isFetching: false,
        isReady: true
      }
    default:
      return state
  }
}

export default reducer
