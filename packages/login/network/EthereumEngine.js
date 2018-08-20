/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import Web3 from 'web3'

export default class EthereumEngine {
  constructor (wallet, network, url, engine) {
    this._wallet = wallet
    this._network = network
    const web3 = engine && new Web3(engine)
    try {
      this._address = engine && web3.eth.accounts[0]
    } catch (e) {
      // FIXME: what is that? Was merged as is long time ago.
      // dispatch(addError(e.message))
    }
  }

  getNetwork () {
    return this._network
  }

  getPrivateKey (address) {
    const wallet = this.getWallet(address)
    return wallet && wallet.getPrivateKey && Buffer.from(wallet.getPrivateKey()).toString('hex')
  }

  getPublicKey () {
    return this._wallet && this._wallet.getPublicKey && Buffer.from(this._wallet.getPublicKey()).toString('hex')
  }

}
