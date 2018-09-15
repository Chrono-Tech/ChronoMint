/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { REHYDRATE } from 'redux-persist'
import * as a from './constants'

const initialState = {
  walletsList: [],
  selectedWallet: null,
  decryptedWallet: null,
  rehydrated: false,
  customNetworksList: [],
}

export default (state = initialState, action) => {
  switch (action.type) {
    case REHYDRATE:
      return {
        ...state,
        ...action.payload.persistAccount,
        rehydrated: true,
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

    case a.CUSTOM_NETWORKS_LIST_ADD :
      return {
        ...state,
        customNetworksList: [
          ...state.customNetworksList,
          action.network,
        ],
      }

    case a.CUSTOM_NETWORKS_LIST_UPDATE :
      return {
        ...state,
        customNetworksList: action.list,
      }

    case a.CUSTOM_NETWORKS_LIST_RESET :
      return {
        ...state,
        customNetworksList: [],
      }

    default:
      return state
  }
}
