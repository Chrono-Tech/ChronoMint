/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { DUCK_MAIN_WALLET } from 'redux/mainWallet/actions'
import { DUCK_MULTISIG_WALLET, selectMultisigWallet } from 'redux/multisigWallet/actions'
import { modalsOpen } from 'redux/modals/actions'
import { getMainWallet, getMultisigWallets } from './selectors/models'

export const DUCK_WALLET = 'wallet'

export const WALLET_SWITCH_WALLET = 'WALLET/switch_wallet'
export const WALLET_SELECT_WALLET = 'WALLET/select_wallet'

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

export const openSendForm = (formProps, Component) => (dispatch, getState) => {
  let wallet
  if (formProps.wallet.isMain) {
    wallet = getMainWallet(getState())
  } else {
    wallet = getMultisigWallets(getState()).item(formProps.wallet.address)
  }
  formProps.wallet = wallet

  dispatch(modalsOpen({
    component: Component,
    props: formProps,
  }))

}