/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import EventEmitter from 'events'
import bitcoin from 'bitcoinjs-lib'

export default class BitcoinTrezorDeviceMock extends EventEmitter {
  constructor ({ seed, network }) {
    super()
    this.seed = seed
    this.network = network
    Object.freeze(this)
  }

  privateKey (path) {
    return this._getDerivedWallet(path).privateKey
  }

  // this method is a part of base interface
  getAddress (path) {
    return this._getDerivedWallet(path).getAddress()
  }

  signTransaction (unsignedTxHex, path) {
    const txb = new bitcoin.TransactionBuilder
      .fromTransaction(bitcoin.Transaction.fromHex(unsignedTxHex), this.network)
    for (let i = 0; i < txb.inputs.length; i++) {
      txb.sign(i, this._getDerivedWallet(path).keyPair)
    }

    return txb.build().toHex()
  }

  _getDerivedWallet (derivedPath) {
    if (this.seed) {
      const wallet = bitcoin.HDNode
        .fromSeedBuffer(Buffer.from(this.seed.substring(2), 'hex'), bitcoin.networks.testnet)
        .derivePath(derivedPath)

      return wallet
    }
  }
}
