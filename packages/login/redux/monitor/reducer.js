/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import * as actions from './constants'

const initialState = {
  network: {
    status: null,
  },
  sync: {
    status: null,
    progress: 0,
  },
}

export default (state = initialState, action) => {
  switch (action.type) {
    case actions.CHANGE_NETWORK_STATUS:
      return {
        ...state,
        network: {
          status: action.status,
        },
      }
    case actions.CHANGE_SYNC_STATUS:
      return {
        ...state,
        sync: {
          status: action.status,
          progress: action.progress,
        },
      }
  }
  return state
}
