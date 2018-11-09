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
import { getWallet as getLHTWallet } from '../../laborHour/selectors/mainSelectors'
import MultisigEthWalletModel from '../../../models/wallet/MultisigEthWalletModel'
import { getEOSWallet } from '../../eos/selectors/mainSelectors'

export const selectWallet = (blockchain, address) =>
  createSelector(
    [
      getWallet(blockchain, address),
      getEOSWallet(`${blockchain}-${address}`),
      getEthMultisigWallet(`${blockchain}-${address}`),
      getLHTWallet(blockchain, address),
    ],
    (...wallets) => {
      const mainSymbol = getMainSymbolForBlockchain(blockchain)
      for (let i = 0; i < wallets.length; i++) {
        const wallet = wallets[i]
        if (wallet) {
          const balance: Amount = wallet.balances[mainSymbol] || null
          return new WalletModel({
            ...wallet,
            amount: balance,
          })
        }
      }
    }
  )

export const getWalletInfo = (blockchain, address) =>
  createSelector([selectWallet(blockchain, address)], (wallet) => {
    return wallet
  })
