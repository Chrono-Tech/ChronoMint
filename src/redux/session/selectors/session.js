/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { createSelector } from 'reselect'
import { PROFILE_PANEL_TOKENS } from 'dao/ERC20ManagerDAO'
import { rebuildProfileTokens } from 'redux/session/actions'
import { selectMainWalletAddressesListStore } from 'redux/wallet/selectors'
import { getTokens } from 'redux/tokens/selectors'
import { getGasSliderCollection, getProfile } from 'redux/session/selectors/models'
import AddressModel from 'models/wallet/AddressModel'

export const getGasPriceMultiplier = (blockchain) => createSelector([getGasSliderCollection],
  (gasSliderCollection) => {
    return gasSliderCollection.get(blockchain) || 1
  },
)

export const getAddressesList = () => createSelector(
  [selectMainWalletAddressesListStore],
  (addressesInWallet: Array<AddressModel>) => {
    return addressesInWallet
      .reduce((accumulator, address: AddressModel, blockchain: string) => {
        accumulator[blockchain] = address.address()
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

export const getProfileTokens = () => createSelector([getProfile, getTokens],
  (profile, tokens) => {
    return rebuildProfileTokens(profile, tokens)
  },
)
