/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { DUCK_ETH_MULTISIG_WALLET } from '../constants'

export const getWallets = (state) => {
  return state.get(DUCK_ETH_MULTISIG_WALLET)
}

export const getEthMultisigWallets = (state) => {
  return state.get(DUCK_ETH_MULTISIG_WALLET)
}

export const getEthMultisigWallet = (walletId) => (state) => {
  return state.get(DUCK_ETH_MULTISIG_WALLET).item(walletId)
}

export const getEthMultisigWalletTransactions = (walletId) => (state) => {
  const wallet = getEthMultisigWallet(walletId)(state)
  return wallet ? wallet.transactions.transactions : null
}
