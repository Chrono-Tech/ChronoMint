/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { createSelector, createSelectorCreator, defaultMemoize } from 'reselect'
import { getWallets } from './models'
import WalletModel from '../../../models/wallet/WalletModel'

export const selectWalletsList = createSelector(
  [
    getWallets,
  ],
  (wallets) => {
    return Object.values(wallets)
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
      .forEach((mainWallet) => {
        const { address, blockchain } = mainWallet
        if (!sectionsObject.hasOwnProperty(blockchain)) {
          sectionsObject[blockchain] = {
            title: blockchain,
            address,
            data: [],
          }
        }
        sectionsObject[blockchain].data.push({
          address: address,
          blockchain,
        })
      })

    return Object.values(sectionsObject)
  },
)
