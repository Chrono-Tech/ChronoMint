/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { createSelector } from 'reselect'

import { getWalletTransactions } from './models'
import { getEthMultisigWalletTransactions } from '../../multisigWallet/selectors/models'
import { getWalletTransactions as getLHTWalletTransactions } from '../../laborHour/selectors/mainSelectors'
import { getEosSigner, getEOSWalletTransactions } from '../../eos/selectors/mainSelectors'
import {
  BLOCKCHAIN_BITCOIN,
  BLOCKCHAIN_BITCOIN_CASH,
  BLOCKCHAIN_DASH,
  BLOCKCHAIN_EOS,
  BLOCKCHAIN_ETHEREUM,
  BLOCKCHAIN_LABOR_HOUR,
  BLOCKCHAIN_LITECOIN,
  BLOCKCHAIN_NEM,
  BLOCKCHAIN_WAVES,
} from '../../../dao/constants'
import { getBitcoinCashSigner, getBitcoinSigner, getLitecoinSigner } from '../../bitcoin/selectors'
import { getDashSigner } from '../../dash/selectors'
import { getEthereumSigner } from '../../ethereum/selectors'
import { getWavesSigner } from '../../waves/selectors'
import { getNemSigner } from '../../nem/selectors'

export const getTxListForWallet = (walletId: string) => createSelector(
  [
    getWalletTransactions(walletId),
    getEthMultisigWalletTransactions(walletId),
    getEOSWalletTransactions(walletId),
    getLHTWalletTransactions(walletId)
  ],
  (
    walletTransactions,
    ethMultisigWalletTransactions,
    eosWalletTransactions,
    getLHTWalletTransactions,
  ) => {
    return walletTransactions || ethMultisigWalletTransactions || eosWalletTransactions || getLHTWalletTransactions || {}
  },
)

export const getSignerByBlockchain = (blockchain) => {
  switch (blockchain) {
    case BLOCKCHAIN_BITCOIN:
      return getBitcoinSigner
    case BLOCKCHAIN_BITCOIN_CASH:
      return getBitcoinCashSigner
    case BLOCKCHAIN_LITECOIN:
      return getLitecoinSigner
    case BLOCKCHAIN_DASH:
      return getDashSigner
    case BLOCKCHAIN_ETHEREUM:
      return getEthereumSigner
    case BLOCKCHAIN_LABOR_HOUR:
      return getEthereumSigner
    case BLOCKCHAIN_NEM:
      return getNemSigner
    case BLOCKCHAIN_WAVES:
      return getWavesSigner
    case BLOCKCHAIN_EOS:
      return getEosSigner
    default:
      throw new Error(`getSelectorByBlockchain unknown blockchain ${blockchain}`)
  }
}
