/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { ethereumProvider } from '@chronobank/login/network/EthereumProvider'
import { bccProvider, btcProvider, ltcProvider } from '@chronobank/login/network/BitcoinProvider'
import { dashProvider } from '@chronobank/login/network/DashProvider'
import { wavesProvider } from '@chronobank/login/network/WavesProvider'
import { nemProvider } from '@chronobank/login/network/NemProvider'
import { selectCurrentNetwork } from '@chronobank/nodes/redux/selectors'

/* eslint-disable-next-line import/prefer-default-export */
export const initProviders = () => async (dispatch, getState) => {
  const { network } = selectCurrentNetwork(getState())

  ethereumProvider.setNetworkSettings(network)
  bccProvider.setNetworkSettings(network)
  btcProvider.setNetworkSettings(network)
  dashProvider.setNetworkSettings(network)
  ltcProvider.setNetworkSettings(network)
  nemProvider.setNetworkSettings(network)
  wavesProvider.setNetworkSettings(network)
}
