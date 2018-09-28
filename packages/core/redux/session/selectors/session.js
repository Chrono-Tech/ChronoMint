/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { createSelector } from 'reselect'
import {
  DUCK_SESSION,
  PROFILE_PANEL_TOKENS,
} from '../constants'
import {
  DUCK_PERSIST_ACCOUNT,
} from '../../persistAccount/constants'
import { getWallets, getMainWallets } from '../../wallets/selectors/models'
import { getGasSliderCollection, getIsCBE } from './models'
import WalletModel from '../../../models/wallet/WalletModel'
import {
  BLOCKCHAIN_BITCOIN,
  BLOCKCHAIN_BITCOIN_CASH,
  BLOCKCHAIN_LITECOIN,
  BLOCKCHAIN_ETHEREUM,
  BLOCKCHAIN_NEM,
  BLOCKCHAIN_WAVES,
} from '../../../dao/constants'

export const getGasPriceMultiplier = (blockchain) => createSelector([getGasSliderCollection],
  (gasSliderCollection) => {
    return gasSliderCollection.get(blockchain) || 1
  },
)

export const getAddressesList = () => createSelector(
  [getMainWallets],
  (wallets: Array<WalletModel>) => {
    return wallets
      .reduce((accumulator, wallet: WalletModel) => {
        accumulator[wallet.blockchain] = wallet.address
        return accumulator
      }, {})
  },
)

export const getBlockchainAddressesList = () => createSelector(
  [getAddressesList()],
  (addresses) => {
    const result = []
    PROFILE_PANEL_TOKENS
      .map((token) => {
        result.push({
          ...token,
          address: addresses[token.blockchain],
        })
      })
    return result
  },
)

export const isCBE = () => createSelector(
  [getIsCBE],
  (isCBE) => isCBE,
)

export const getProfileSignature = createSelector(
  (state) => state.get(DUCK_SESSION),
  (session) => {
    const { profileSignature } = session
    return profileSignature && profileSignature.profile
  },
)

export const getSelectedAccountName = createSelector(
  (state) => state.get(DUCK_PERSIST_ACCOUNT),
  (persistAccount) => {
    const { selectedWallet } = persistAccount

    return selectedWallet && selectedWallet.name
  },
)

export const getAccountProfileSummary = createSelector(
  [
    getProfileSignature,
    getSelectedAccountName,
  ],
  (profile, selectedAccountName) => {
    if (profile) {
      const level1 = profile.level1.submitted
      const level2 = profile.level2.submitted

      return {
        userName: level1 && level1.userName || selectedAccountName,
        avatar: level1 && level1.avatar && level1.avatar.id,
        phone: level2 && level2.phone,
        email: level2 && level2.email,
        company: level2 && level2.company,
        website: level2 && level2.website,
      }
    }

    return {}
  },
)

export const getAccountAddresses = createSelector(
  [
    getWallets,
  ],
  (wallets) => {
    let type = null
    return Object.values(wallets).reduce((accumulator, wallet) => {
      switch (wallet.blockchain) {
        case BLOCKCHAIN_BITCOIN:
          type = 'bitcoin-address'
          break
        case BLOCKCHAIN_BITCOIN_CASH:
          type = 'bitcoin-cash-address'
          break
        case BLOCKCHAIN_LITECOIN:
          type = 'bitcoin-litecoin-address'
          break
        case BLOCKCHAIN_ETHEREUM:
          type = 'ethereum-public-key'
          break
        case BLOCKCHAIN_NEM:
          type = 'nem-address'
          break
        case BLOCKCHAIN_WAVES:
          type = 'waves-address'
          break
      }

      if (!wallet.isMain || !type) {
        return accumulator
      }

      return [...accumulator, { type, value: wallet.address },
      ]
    }, {})
  },
)
