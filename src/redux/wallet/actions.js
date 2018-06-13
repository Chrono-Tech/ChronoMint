/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { DUCK_MAIN_WALLET } from 'redux/mainWallet/actions'
import { DUCK_MULTISIG_WALLET, selectMultisigWallet } from 'redux/multisigWallet/actions'

export const DUCK_WALLET = 'wallet'

export const WALLET_SWITCH_WALLET = 'WALLET/switch_wallet'
export const WALLET_SELECT_WALLET = 'WALLET/select_wallet'

export const WALLETS_ADD = 'WALLET/add'
export const WALLETS_SELECT = 'WALLET/select'
export const WALLETS_LOAD = 'WALLET/load'
export const WALLETS_UPDATE_LIST = 'WALLET/updateList'
export const WALLETS_REMOVE = 'WALLET/remove'

export const switchWallet = (wallet) => (dispatch) => {
  const isMultisig = wallet.isMultisig()
  dispatch({ type: WALLET_SWITCH_WALLET, isMultisig })
  if (isMultisig) {
    dispatch(selectMultisigWallet(wallet.id()))
  }
}

// TODO @ipavlenko: Move to ./selectors.js
export const getCurrentWallet = (state) => {
  const { isMultisig } = state.get(DUCK_WALLET)

  return isMultisig
    ? state.get(DUCK_MULTISIG_WALLET).selected()
    : state.get(DUCK_MAIN_WALLET)
}

export const selectWallet = (blockchain: string, address: string) => (dispatch) => {
  dispatch({ type: WALLET_SELECT_WALLET, blockchain, address })
}

export const walletAdd = (wallet) => (dispatch) => {
  dispatch({ type: WALLETS_ADD, wallet })
}

export const walletSelect = (wallet) => (dispatch) => {
  dispatch({ type: WALLETS_SELECT, wallet })
}

export const walletLoad = (wallet) => (dispatch) => {
  dispatch({ type: WALLETS_LOAD, wallet })
}

export const walletUpdateList = (walletList) => (dispatch) => {
  dispatch({ type: WALLETS_UPDATE_LIST, walletList })
}

export const walletRemove = (name) => (dispatch) => {
  dispatch({ type: WALLETS_REMOVE, name })
}
