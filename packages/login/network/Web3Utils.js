/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import Web3 from 'web3'
import ProviderEngine from 'web3-provider-engine'
import FilterSubprovider from 'web3-provider-engine/subproviders/filters'
import WalletSubprovider from 'web3-provider-engine/subproviders/wallet'
import RpcSubprovider from 'web3-provider-engine/subproviders/rpc'

export default class Web3Utils {
  static createEngine (wallet, providerUrl) {
    const engine = new ProviderEngine()


    engine.addProvider(new FilterSubprovider())
    engine.addProvider(new WalletSubprovider(wallet, {}))
    engine.addProvider(new RpcSubprovider({rpcUrl: providerUrl}))
    engine.start()

    return engine
  }

  static createStatusEngine (providerUrl) {
    const engine = new ProviderEngine()

    engine.addProvider(new RpcSubprovider({rpcUrl: providerUrl}))
    engine.start()

    return engine
  }
}
