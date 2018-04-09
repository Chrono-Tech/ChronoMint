/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { NETWORK_MAIN_ID } from './settings'

// Universal id for networks to decide network type
export const MAINNET = 'mainnet'
export const TESTNET = 'testnet'

export const byEthereumNetwork = (network) => network.id === NETWORK_MAIN_ID ? MAINNET : TESTNET

class NetworkProvider {

  constructor (networkCode) {
    this.networkCode = networkCode
  }

  setNetworkCode (networkCode) {
    this.networkCode = networkCode
  }

  getNetworkCode () {
    return this.networkCode
  }

  selectNetwork (mainnetConfig, testnetConfig) {
    return this.networkCode === MAINNET ? mainnetConfig : testnetConfig
  }
}

export default new NetworkProvider(process.env.NODE_ENV === 'production' ? MAINNET : TESTNET)
