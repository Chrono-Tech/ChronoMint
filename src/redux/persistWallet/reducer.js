/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import * as a from './actions'
import { removeWallet } from './utils'

const initialState = {
  walletsList: [],
  selectedWallet: null,
  decryptedWallet: null,
}

export default (state = initialState, action) => {
  switch (action.type) {
    case a.WALLETS_ADD :
      return {
        ...state,
        walletsList: [
          ...state.walletsList,
          action.wallet,
        ],
      }

    case a.WALLETS_SELECT :
      return {
        ...state,
        selectedWallet: action.wallet,
      }

    case a.WALLETS_LOAD :
      return {
        ...state,
        decryptedWallet: action.wallet,
      }

    case a.WALLETS_UPDATE_LIST :
      return {
        ...state,
        walletsList: action.walletsList,
      }

    case a.WALLETS_REMOVE :
      return {
        ...state,
        walletsList: removeWallet(state.walletsList, action.name),
      }

    default:
      return state
  }
}
