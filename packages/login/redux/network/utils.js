/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 *
 * @flow
 */

/* eslint-disable import/prefer-default-export */

import { ethereumProvider } from '../../network/EthereumProvider'
import {
  btcProvider,
  btgProvider,
  ltcProvider,
} from '../../network/BitcoinProvider'
import { nemProvider } from '../../network/NemProvider'

export const getPrivateKeyFromBlockchain = (blockchain: string) => {
  switch (blockchain) {
    case 'Ethereum':
      return ethereumProvider.getPrivateKey()
    case 'Bitcoin':
      return btcProvider.getPrivateKey()
    case 'Bitcoin Gold':
      return btgProvider.getPrivateKey()
    case 'Litecoin':
      return ltcProvider.getPrivateKey()
    case 'NEM':
      return nemProvider.getPrivateKey()
    default:
      return null
  }
}

export const checkTestRPC = (/*providerUrl*/) => {
  return false
}
