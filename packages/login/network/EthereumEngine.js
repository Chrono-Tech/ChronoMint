/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import Web3Utils from '@chronobank/login/network/Web3Utils'

export default class EthereumEngine {
  constructor (wallet, network, url, engine) {
    this._wallet = wallet
    this._network = network
    this._engine = engine || Web3Utils.createEngine(wallet, url)
  }

  getNetwork () {
    return this._network
  }

  getAddress () {
    return this._wallet.getAddressString()
  }

  getProvider () {
    return this._engine
  }

  getPrivateKey () {
    return this._wallet && this._wallet.getPrivateKey && Buffer.from(this._wallet.getPrivateKey()).toString('hex')
  }
}
