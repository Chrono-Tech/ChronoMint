/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import * as a from './actions'

const initialState = {
  isMultisig: false,
  blockchain: null,
  address: null,
  walletsList: [],
  selectedWallet: null,
  decryptedWallet: null,
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

    default:
      return state
  }
}
