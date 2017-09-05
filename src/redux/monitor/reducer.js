import * as actions from './actions'

const initialState = {
  network: {
    status: null
  },
  sync: {
    status: null,
    progress: 0
  }
}

export default (state = initialState, action) => {
  switch (action.type) {
    case actions.CHANGE_NETWORK_STATUS:
      return {
        ...state,
        network: {
          status: action.status
        }
      }
    case actions.CHANGE_SYNC_STATUS:
      return {
        ...state,
        sync: {
          status: action.status,
          progress: actions.progress
        }
      }
  }
  return state
}
