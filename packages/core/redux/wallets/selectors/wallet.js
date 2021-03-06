/**
 * Copyright 2017–2019, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { createSelector } from 'reselect'
import { getMainSymbolForBlockchain } from '../../../redux/tokens/selectors'
import { getWallet } from './models'
import WalletModel from '../../../models/wallet/WalletModel'
import Amount from '../../../models/Amount'
import { getEthMultisigWallet } from '../../multisigWallet/selectors/models'
import MultisigEthWalletModel from '../../../models/wallet/MultisigEthWalletModel'
import { getEOSWallet } from '../../eos/selectors/mainSelectors'

export const selectWallet = (blockchain, address) => createSelector(
  [
    getWallet(blockchain, address),
    getEOSWallet(`${blockchain}-${address}`),
    getEthMultisigWallet(`${blockchain}-${address}`),
  ],
  (wallet, eosWallet, ethMultisigWallet) => {
    const mainSymbol = getMainSymbolForBlockchain(blockchain)

    if (wallet) {
      const balance: Amount = wallet.balances[mainSymbol] || null
      return new WalletModel({
        ...wallet,
        amount: balance,
      })
    }
    if (eosWallet) {
      const balance: Amount = eosWallet ? eosWallet.balances[mainSymbol] : null
      return new WalletModel({
        ...eosWallet,
        amount: balance,
      })
    }
    if (ethMultisigWallet) {
      const balance: Amount = ethMultisigWallet.balances[mainSymbol] || null
      return new MultisigEthWalletModel({
        ...ethMultisigWallet,
        amount: balance,
      })
    }
  },
)

export const getWalletInfo = (blockchain, address) => createSelector(
  [
    selectWallet(blockchain, address),
  ],
  (
    wallet,
  ) => {
    return wallet
  },
)
