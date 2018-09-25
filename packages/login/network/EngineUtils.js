/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

// #region imports

import { ethereumProvider } from './EthereumProvider'
import networkProvider from './NetworkProvider'
import {
  bccProvider,
  btcProvider,
  ltcProvider,
} from './BitcoinProvider'
import { nemProvider } from './NemProvider'
import { wavesProvider } from './WavesProvider'

// #endregion

const setup = ({ networkCode, ethereum, btc, bcc, ltc, nem, waves }) => {
  // const web3 = new Web3()
  // web3Provider.reinit(web3, ethereum.getProvider())
  networkProvider.setNetworkCode(networkCode)
  ethereumProvider.setEngine(ethereum, nem, waves)
  bcc && bccProvider.setEngine(bcc)
  btc && btcProvider.setEngine(btc)
  ltc && ltcProvider.setEngine(ltc)
  nem && nemProvider.setEngine(nem)
  waves && wavesProvider.setEngine(waves)
}

export default setup
