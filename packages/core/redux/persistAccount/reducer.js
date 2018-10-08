/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { REHYDRATE } from 'redux-persist'
import * as persistAccountActionTypes from './constants'

const initialState = {
  customNetworksList: [],
  decryptedWallet: null,
  isLoadingSignatures: false,
  locale: 'en',
  selectedWallet: null,
  walletsList: [],
}

const mutations = {

  [REHYDRATE]: (state, payload) => {
    // action.payload is undefined if LocalStorage is empty
    // See https://github.com/rt2zz/redux-persist/issues/719
    if (!payload) {
      return state
    }

    return {
      ...state,
      ...payload.persistAccount,
    }
  },

  [persistAccountActionTypes.PERSIST_ACCOUNT_SIGNATURES_LOADING]: (state) => ({
    ...state,
    isLoadingSignatures: true,
  }),

  [persistAccountActionTypes.PERSIST_ACCOUNT_SIGNATURES_RESET_LOADING]: (state) => ({
    ...state,
    isLoadingSignatures: true,
  }),

  [persistAccountActionTypes.PERSIST_ACCOUNT_SET_LOCALE]: (state, payload) => {
    return {
      ...state,
      locale: payload.locale,
    }
  },

  [persistAccountActionTypes.WALLETS_ADD]: (state, payload) => {
    return {
      ...state,
      walletsList: [
        ...state.walletsList,
        payload.wallet,
      ],
    }
  },

  [persistAccountActionTypes.WALLETS_SELECT]: (state, payload) => {
    return {
      ...state,
      selectedWallet: payload.wallet,
    }
  },

  [persistAccountActionTypes.WALLETS_LOAD]: (state, payload) => {
    return {
      ...state,
      decryptedWallet: payload.wallet,
    }
  },

  [persistAccountActionTypes.WALLETS_UPDATE_LIST]: (state, payload) => {
    return {
      ...state,
      walletsList: payload.walletsList,
    }
  },

  [persistAccountActionTypes.CUSTOM_NETWORKS_LIST_ADD]: (state, payload) => {
    return {
      ...state,
      customNetworksList: [
        ...state.customNetworksList,
        payload.network,
      ],
    }
  },

  [persistAccountActionTypes.CUSTOM_NETWORKS_LIST_UPDATE]: (state, payload) => {
    return {
      ...state,
      customNetworksList: payload.list,
    }
  },

  [persistAccountActionTypes.CUSTOM_NETWORKS_LIST_RESET]: (state) => {
    return {
      ...state,
      customNetworksList: [],
    }
  },

}

export default (state = initialState, { type, ...payload }) => {
  return (type in mutations)
    ? mutations[type](state, payload)
    : state
}
