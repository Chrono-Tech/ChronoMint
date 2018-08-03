/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import * as a from './constants'

const initialState = {
  isHttps: window.location.protocol === 'https:',
  isU2F: false,
  isETHAppOpened: false,
  isFetching: false,
  isFetched: false,
}

export default (state = initialState, action) => {
  switch (action.type) {
    case a.LEDGER_SET_U2F:
      return {
        ...state,
        isU2F: action.isU2F,
      }
    case a.LEDGER_SET_ETH_APP_OPENED:
      return {
        ...state,
        isETHAppOpened: action.isETHAppOpened,
      }
    case a.LEDGER_FETCHING:
      return {
        ...state,
        isFetching: true,
      }
    case a.LEDGER_FETCHED:
      return {
        ...state,
        isFetched: action.isFetched,
        isFetching: false,
      }
    default:
      return state
  }
}
