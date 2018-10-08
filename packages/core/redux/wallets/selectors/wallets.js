/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { createSelector, createSelectorCreator, defaultMemoize } from 'reselect'
import { getWallets, getWalletsLengthFromState } from './models'
import WalletModel from '../../../models/wallet/WalletModel'
import { getAccount } from '../../session/selectors/models'
import { getEthMultisigWallets } from '../../multisigWallet/selectors/models'
import { DUCK_WALLETS } from '../constants'

export const selectDuckWallets = (state) => state.get(DUCK_WALLETS)

export const selectWalletByBlockchain = (blockchain) => createSelector(
  selectDuckWallets,
  (wallets) => wallets.find((wallet) => wallet.blockchain === blockchain)
)

export const selectWalletAddressByBlockchain = (blockchain) => createSelector(
  selectWalletByBlockchain(blockchain),
  (wallet) => wallet.address
)

export const selectWalletsList = createSelector(
  [
    getAccount,
    getWallets,
    getEthMultisigWallets,
  ],
  (account, wallets, ethMultisigWallets) => {
    return [
      ...Object.values(wallets)
        .filter((wallet: WalletModel) => !(!wallet.address || !wallet.blockchain))
        .filter((wallet: WalletModel) => wallet.isDerived ? wallet.owners.includes(account) : true),
      ...ethMultisigWallets.items(),
    ]
      .map((wallet: WalletModel) => {
        const jsWallet = Object.create(null)
        jsWallet['address'] = wallet.address
        jsWallet['blockchain'] = wallet.blockchain
        return jsWallet
      })
      .sort(({ blockchain: a }, { blockchain: b }) =>
        (a > b) - (a < b),
      )
  },
)

export const selectMainWalletsList = createSelector(
  selectWalletsList,
  (wallets) => wallets.filter((wallet) => wallet.isMain)
)

const createSectionsSelector = createSelectorCreator(
  defaultMemoize,
  (a, b) => {
    if (a.length !== b.length) {
      return false
    }
    let compareResult = true
    for (let i = 0; i++; i <= a.length) {
      if (a[i].blockchain !== b[i].blockchain || a[i].address !== b[i].address) {
        compareResult = false
        break
      }
    }
    return compareResult
  },
)

export const sectionsSelector = createSectionsSelector(
  [
    selectWalletsList,
  ],
  (
    walletsList,
  ) => {

    const sectionsObject = {}

    walletsList
      .forEach((wallet) => {
        const { address, blockchain } = wallet
        if (!sectionsObject.hasOwnProperty(blockchain)) {
          sectionsObject[blockchain] = {
            title: blockchain,
            address,
            data: [],
          }
        }
        sectionsObject[blockchain].data.push({
          address,
          blockchain,
        })
      })

    return Object.values(sectionsObject)
  },
)

export const getWalletsLength = createSelector(
  [
    getWalletsLengthFromState,
  ],
  (length) => length,
)
