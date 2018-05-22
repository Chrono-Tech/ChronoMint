/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import Web3 from 'web3'
import ProviderEngine from 'web3-provider-engine'
import Web3Subprovider from 'web3-provider-engine/subproviders/web3'
import HDWalletProvider from './HDWalletProvider'

export default class Web3Utils {
  static createEngine (wallet, providerUrl) {
    return new HDWalletProvider(wallet, providerUrl, 0, 100)
  }

  static createStatusEngine (providerUrl) {
    const engine = new ProviderEngine()

    engine.addProvider(new RpcSubprovider({rpcUrl: providerUrl}))
    engine.start()

    return engine
  }
}
