/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import HDWalletProvider from './HDWalletProvider'

export default class Web3Utils {
  static createEngine (wallet, providerUrl, deriveNumber) {
    return new HDWalletProvider(wallet, providerUrl, 0, deriveNumber)
  }

}
