/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { TRANSACTIONS_NEW, TRANSACTIONS_REMOVE } from './constants'

export const initialState = {
  tx: null,
}

export default (state = initialState, action) => {
  switch (action.type) {
    case TRANSACTIONS_NEW:
      return {
        ...state,
        tx: action.tx,
      }
    case TRANSACTIONS_REMOVE:
      return {
        ...state,
        tx: null,
      }
    default:
      return state
  }
}
