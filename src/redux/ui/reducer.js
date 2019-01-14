/**
 * Copyright 2017–2019, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import {
  CHANGE_WALLET_VIEW,
  SET_VISIBLE_COOKIES_BAR,
} from './constants'

const initialState = {
  isCompactWalletView: false,
  isCookiesBarVisible: false,
}

const mutations = {
  [CHANGE_WALLET_VIEW]: (state) => {
    return {
      ...state,
      isCompactWalletView: !state.isCompactWalletView,
    }
  },
  [SET_VISIBLE_COOKIES_BAR]: (state, { isCookiesBarVisible }) => {
    return {
      ...state,
      isCookiesBarVisible,
    }
  },
}

export default (state = initialState, { type, ...payload }) => {
  return (type in mutations)
    ? mutations[type](state, payload)
    : state
}
