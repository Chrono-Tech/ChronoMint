/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */
import ProviderEngine from 'web3-provider-engine'
import RpcSubprovider from 'web3-provider-engine/subproviders/rpc'

import HDWalletProvider from './HDWalletProvider'

export default class Web3Utils {
  static createEngine (wallet, providerUrl, deriveNumber) {
    return new HDWalletProvider(wallet, providerUrl, 0, deriveNumber)
  }

  static createStatusEngine (providerUrl) {
    const engine = new ProviderEngine()

    engine.addProvider(new RpcSubprovider({ rpcUrl: providerUrl }))
    engine.start()

    return engine
  }
}
