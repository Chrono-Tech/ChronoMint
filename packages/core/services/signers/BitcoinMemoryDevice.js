/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import EventEmitter from 'events'
import bitcore from 'bitcore-lib'
import bitcoin from 'bitcoinjs-lib'

export default class BitcoinMemoryDevice extends EventEmitter {
  constructor ({ seed, network }) {
    super()
    this.seed = seed
    this.network = network
    Object.freeze(this)
  }

  privateKey (path) {
    return this._getDerivedWallet(path).privateKey
  }

  getAddress (path) {
    return this._getDerivedWallet(path).privateKey.toAddress(this.network)
  }

  signTransaction (unsignedTxHex, path) {
    console.log('signTransaction: MemoryDevice: ', unsignedTxHex)

    const txb = new bitcoin.TransactionBuilder
      .fromTransaction(bitcoin.Transaction.fromHex(unsignedTxHex), this.network)

    console.log('txbtxbtxb: ', txb)

    for (let i = 0; i < txb.__inputs.length; i++) {
      txb.sign(i, this._getDerivedWallet(path).keyPair)
    }

    return txb.build().toHex()
  }

  _getDerivedWallet (derivedPath) {
    if (this.seed.length > 64) {
      const HDPrivateKey = bitcore.HDPrivateKey

      const hdPrivateKey = new HDPrivateKey()
      const derived = hdPrivateKey.derive(derivedPath)
      return derived
    }
    const PrivateKey = bitcore.PrivateKey
    const imported = PrivateKey.fromWIF(this.seed)

    return imported
  }
}
