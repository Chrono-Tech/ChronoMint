/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import * as a from './constants'

const initialState = {
  isMultisig: false,
  blockchain: null,
  address: null,
}

export default (state = initialState, action) => {
  switch (action.type) {
    case a.WALLET_SWITCH_WALLET:
      return {
        ...state,
        isMultisig: action.isMultisig,
      }
    case a.WALLET_SELECT_WALLET:
      return {
        ...state,
        blockchain: action.blockchain,
        address: action.address,
      }

    default:
      return state
  }
}
