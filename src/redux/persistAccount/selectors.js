/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { createSelector } from 'reselect'

export const getSelectedNetwork = () => createSelector(
  (state) => state.get('network'),
  (network) => {
    if (!network.selectedNetworkId){
      return null
    }

    return network.networks && network.networks.find(
      (item) => item.id === network.selectedNetworkId
    )
  },
)
