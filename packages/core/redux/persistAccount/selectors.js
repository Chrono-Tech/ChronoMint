/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { createSelector } from 'reselect'
import { DUCK_NETWORK } from '@chronobank/login/redux/network/constants'

// eslint-disable-next-line import/prefer-default-export
export const getSelectedNetwork = () => createSelector(
  (state) => state.get(DUCK_NETWORK),
  (network) => {
    if (!network.selectedNetworkId){
      return null
    }

    return network.networks && network.networks.find(
      (item) => item.id === network.selectedNetworkId
    )
  },
)
