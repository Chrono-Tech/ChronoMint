/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { createSelector } from 'reselect'
import { DUCK_NETWORK } from '@chronobank/login/redux/network/constants'
import { DUCK_PERSIST_ACCOUNT } from './constants'

export const getPersistAccount = (state) => {
  return state.get(DUCK_PERSIST_ACCOUNT)
}

export const getSigner = (state) => {
  const { decryptedWallet } = getPersistAccount(state)
  return decryptedWallet
}

export const getNetwork = (state) => {
  return state.get(DUCK_NETWORK)
}

export const getSelectedNetworkId = (state) => {
  const { selectedNetworkId } = getNetwork(state)
  return selectedNetworkId
}

export const getSelectedNetwork = () => createSelector(
  getNetwork,
  (network) => {
    if (!network.selectedNetworkId) {
      return null
    }

    return network.networks && network.networks.find(
      (item) => item.id === network.selectedNetworkId,
    )
  },
)

export const getCustomNetworksList = createSelector(
  (state) => state.get(DUCK_PERSIST_ACCOUNT),
  (persistAccount) => persistAccount.customNetworksList
)
