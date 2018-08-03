/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { createSelector } from 'reselect'
import { PROFILE_PANEL_TOKENS } from '../constants'
import { getMainWallets } from '../../wallets/selectors/models'
import { getGasSliderCollection, getIsCBE } from './models'
import WalletModel from '../../../models/wallet/WalletModel'
import { DUCK_SESSION } from '../../session/constants'

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
    let result = []
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

export const getAccountProfileSummary = createSelector(
  getProfileSignature,
  (profile) => {
    if (profile){
      const level1 = profile.level1.submitted
      const level2 = profile.level2.submitted

      return {
        userName: level1 && level1.userName,
        avatar: level1 && level1.avatar && level1.avatar.id,
        phone: level2 && level2.phone,
        email: level2 && level2.email,
        company: level2 && level2.company,
        website: level2 && level2.website,
      }
    }

    return {}
  }
)
