/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import {
  OPEN_BRAND_PARTIAL,
  CHANGE_WALLET_VIEW,
} from './constants'

const initialState = {
  open: false,
  isCompactWalletView: false,
}

export default (state = initialState, action) => {
  switch (action.type) {
    case OPEN_BRAND_PARTIAL:
      return {
        ...state,
        open: action.payload.open,
      }
    case CHANGE_WALLET_VIEW:
      return {
        ...state,
        isCompactWalletView: !state.isCompactWalletView,
      }
    default:
      return state
  }
}
