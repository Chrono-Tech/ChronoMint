/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { persistReducer, REHYDRATE } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import * as a from './constants'

const persistConfig = {
  key: 'account',
  storage: storage,
  blacklist: ['decryptedWallet', 'rehydrated'],
}

const initialState = {
  walletsList: [],
  selectedWallet: null,
  decryptedWallet: null,
  rehydrated: false,
  customNetworksList: [],
  addressCache: {},
  assetsDirectoryNamesList: {},
}

const persistAccount = (state = initialState, action) => {
  switch (action.type) {
    case REHYDRATE:
      return {
        ...state,
        ...action.payload.persistAccount,
        rehydrated: true,
      }
    case a.ASSET_ADD_DIRECTORY_NAMES_LIST:
      return {
        ...state,
        assetsDirectoryNamesList: {
          ...state.assetsDirectoryNamesList,
          [action.name]: action.address,
        },
      }
    case a.WALLETS_ADD:
      return {
        ...state,
        walletsList: [
          ...state.walletsList,
          action.wallet,
        ],
      }
    case a.WALLETS_SELECT:
      return {
        ...state,
        selectedWallet: action.wallet,
      }
    case a.WALLETS_LOAD:
      return {
        ...state,
        decryptedWallet: action.wallet,
      }
    case a.WALLETS_UPDATE_LIST:
      return {
        ...state,
        walletsList: action.walletsList,
      }

    case a.WALLETS_CACHE_ADDRESS: {
      const selectedWalletKey = state.selectedWallet.key
      return {
        ...state,
        addressCache: {
          ...state.addressCache,
          [selectedWalletKey]: {
            ...state.addressCache[selectedWalletKey],
            [action.blockchain]: {
              address: action.address,
              path: action.path,
            },
          },
        },
      }
    }
    case a.CUSTOM_NETWORKS_LIST_ADD:
      return {
        ...state,
        customNetworksList: [
          ...state.customNetworksList,
          action.network,
        ],
      }
    case a.CUSTOM_NETWORKS_LIST_UPDATE:
      return {
        ...state,
        customNetworksList: action.list,
      }
    case a.CUSTOM_NETWORKS_LIST_RESET:
      return {
        ...state,
        customNetworksList: [],
      }
    case a.BLOCKCHAIN_LIST_UPDATE:
      const wallet = state.walletsList.find((w) => w.key === action.walletKey)
      wallet.blockchainList = action.blockchainList

      if (!wallet) {
        return {
          ...state,
        }
      }

      return {
        ...state,
        walletsList: [
          ...state.walletsList.filter((w) => w.key !== action.walletKey),
          wallet,
        ],
      }

    default:
      return state
  }
}

export default persistReducer(persistConfig, persistAccount)
