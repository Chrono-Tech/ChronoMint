/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { createSelector } from 'reselect'
import { getMainSymbolForBlockchain } from '../../../redux/tokens/selectors'
import { getWallet } from './models'
import WalletModel from '../../../models/wallet/WalletModel'
import Amount from '../../../models/Amount'
import { getEthMultisigWallet } from '../../multisigWallet/selectors/models'
import MultisigEthWalletModel from '../../../models/wallet/MultisigEthWalletModel'

export const selectWallet = (blockchain, address) => createSelector(
  [
    getWallet(`${blockchain}-${address}`),
    getEthMultisigWallet(`${blockchain}-${address}`),
  ],
  (wallet, ethMultisigWallet) => {
    const mainSymbol = getMainSymbolForBlockchain(blockchain)

    if (wallet) {
      const balance: Amount = wallet ? wallet.balances[mainSymbol] : new Amount(0, mainSymbol)
      return new WalletModel({
        ...wallet,
        amount: balance,
      })
    }
    if (ethMultisigWallet) {
      const balance: Amount = ethMultisigWallet ? ethMultisigWallet.balances[mainSymbol] : new Amount(0, mainSymbol)
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
