/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { createSelector } from 'reselect'
import { getMainSymbolForBlockchain } from '../../../redux/tokens/selectors'
import { getWallets } from './models'
import WalletModel from '../../../models/wallet/WalletModel'
import Amount from '../../../models/Amount'
import { getEthMultisigWallets } from '../../multisigWallet/selectors/models'
import MultisigEthWalletModel from '../../../models/wallet/MultisigEthWalletModel'

export const selectWallet = (blockchain, address) => createSelector(
  [
    getWallets,
    getEthMultisigWallets,
  ],
  (wallets, ethMultisigWallets) => {
    const mainSymbol = getMainSymbolForBlockchain(blockchain)
    const walletId = `${blockchain}-${address}`

    let wallet: WalletModel = wallets[walletId]
    if (wallet) {
      const balance: Amount = wallet ? wallet.balances[mainSymbol] : new Amount(0, mainSymbol)
      return new WalletModel({
        ...wallet,
        amount: balance,
      })
    }
    wallet = ethMultisigWallets.item(walletId)
    const balance: Amount = wallet ? wallet.balances[mainSymbol] : new Amount(0, mainSymbol)
    return new MultisigEthWalletModel({
      ...wallet,
      amount: balance,
    })

  },
)

export const getWalletInfo = (blockchain, address) => createSelector(
  [
    selectWallet(blockchain, address),
  ],
  (
    wallet,
  ) => wallet,
)
