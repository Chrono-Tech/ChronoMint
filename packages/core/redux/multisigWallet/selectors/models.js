/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { DUCK_ETH_MULTISIG_WALLET } from '../constants'
import { BLOCKCHAIN_ETHEREUM } from '../../../dao/constants'

const duckMap = {
  [BLOCKCHAIN_ETHEREUM]: DUCK_ETH_MULTISIG_WALLET
}

export const getEthLikeMultisigWallets = (state, blockchain) => state.get(duckMap[blockchain])

export const getEthLikeMultisigWallet = (walletId, blockchain) => (
  (state) => state.get(duckMap[blockchain]).item(walletId)
)

export const getEthLikeMultisigWalletTransactions = (walletId, blockchain) => (state) => {
  const wallet = getEthLikeMultisigWallet(walletId, blockchain)(state)
  return wallet ? wallet.transactions : null
}

export const getWallets = (state) => getEthLikeMultisigWallets(state, BLOCKCHAIN_ETHEREUM)
export const getEthMultisigWallets = (state) => getEthLikeMultisigWallets(state, BLOCKCHAIN_ETHEREUM)
export const getEthMultisigWallet = (walletId) => getEthLikeMultisigWallet(walletId, BLOCKCHAIN_ETHEREUM)

export const getEthMultisigWalletTransactions = (walletId) => (
  getEthLikeMultisigWalletTransactions(walletId, BLOCKCHAIN_ETHEREUM)
)
