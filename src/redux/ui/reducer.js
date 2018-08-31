/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { REHYDRATE } from 'redux-persist'
import {
  CHANGE_WALLET_VIEW,
  UI_SET_LOCALE,
} from './constants'

const initialState = {
  isCompactWalletView: false,
  locale: 'en',
  rehydrated: false,
}

export default (state = initialState, action) => {
  switch (action.type) {
    case REHYDRATE: {
      console.log('UI REHYDRATE action', action)
      return {
        ...state,
        locale: action.locale || 'en',
        isCompactWalletView: action.isCompactWalletView || false,
        rehydrated: true,
      }
    }
    case CHANGE_WALLET_VIEW:
      return {
        ...state,
        isCompactWalletView: !state.isCompactWalletView,
      }
    case UI_SET_LOCALE:
      return {
        ...state,
        locale: action.locale,
      }
    default:
      return state
  }
}
