/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import Web3 from 'web3'
import ProviderEngine from 'web3-provider-engine'
import Web3Subprovider from 'web3-provider-engine/subproviders/web3'
import HDWalletProvider from './HDWalletProvider'

export default class Web3Utils {
  static createEngine (wallet, providerUrl, deriveNumber) {
    return new HDWalletProvider(wallet, providerUrl, 0, deriveNumber)
  }

  static createStatusEngine (providerUrl) {
    const engine = new ProviderEngine()

    console.log('createStatusEngine', providerUrl)
    const httpProvider = new Web3.providers.HttpProvider(providerUrl)
    engine.addProvider(new Web3Subprovider(httpProvider))
    engine.start()

    return engine
  }
}
