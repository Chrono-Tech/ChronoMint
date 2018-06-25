/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { createSelector, createSelectorCreator, defaultMemoize } from 'reselect'
import MainWalletModel from '@chronobank/core/models/wallet/MainWalletModel'
import MultisigWalletModel from '@chronobank/core/models/wallet/MultisigWalletModel'
import AddressModel from '@chronobank/core/models/wallet/AddressModel'
import MultisigWalletCollection from '@chronobank/core/models/wallet/MultisigWalletCollection'
import { getMainWallet, getMultisigWallets } from '@chronobank/core/redux/wallet/selectors'

// provides filtered list of addresses of MainWallets
export const selectMainWalletsList = createSelector(
  [
    getMainWallet,
  ],
  (mainWallet: MainWalletModel) => {
    return mainWallet
      .addresses()
      .items()
      .filter((addressModel: AddressModel) =>
        addressModel.id() && addressModel.address(),
      )
      .map((addressModel: AddressModel) => {
        const blockchain: string = addressModel.id()
        const address: ?string = addressModel.address()
        const jsWallet = Object.create(null)
        jsWallet['address'] = address
        jsWallet['blockchain'] = blockchain
        return jsWallet
      })
      .sort(({ blockchain: a }, { blockchain: b }) =>
        (a > b) - (a < b),
      )
  },
)

// provides filtered list of addresses of MainWallets
export const selectMultisigWalletsList = createSelector(
  [
    getMultisigWallets,
  ],
  (MultisigWallets: MultisigWalletCollection) =>
    MultisigWallets
      .items()
      .map((wallet: MultisigWalletModel) => {
        const jsWallet = Object.create(null)
        jsWallet['address'] = wallet.address()
        jsWallet['blockchain'] = wallet.blockchain()
        return jsWallet
      })
      .sort(({ blockchain: a }, { blockchain: b }) =>
        (a > b) - (a < b),
      ),
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
    selectMainWalletsList,
    selectMultisigWalletsList,
  ],
  (
    mainWalletsList,
    multisigWalletsList,
  ) => {

    const sectionsObject = {}
    const callback = (mainWallet) => {
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
    }

    mainWalletsList
      .forEach(callback)

    multisigWalletsList
      .forEach(callback)

    return Object.values(sectionsObject)
  },
)
