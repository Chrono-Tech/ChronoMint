/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { createSelector } from 'reselect'
import { DUCK_PERSIST_ACCOUNT } from './actions'

export const getPersistAccount = (state) => {
  return state.get(DUCK_PERSIST_ACCOUNT)
}

export const getSigner = (state) => {
  const { decryptedWallet } = getPersistAccount(state)
  return decryptedWallet
}

export const getSelectedNetwork = () => createSelector(
  (state) => state.get('network'),
  (network) => {
    if (!network.selectedNetworkId) {
      return null
    }

    return network.networks && network.networks.find(
      (item) => item.id === network.selectedNetworkId,
    )
  },
)
