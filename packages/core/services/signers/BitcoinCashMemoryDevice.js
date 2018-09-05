/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import EventEmitter from 'events'
import bitcoin from 'bitcoinjs-lib'

export default class BitcoinMemoryDevice extends EventEmitter {
  constructor ({ privateKey, network }) {
    super()
    this.privateKey = privateKey
    this.network = network
    Object.freeze(this)
  }

  signTransaction (unsignedTxHex) {
    const txb = new bitcoin.TransactionBuilder
      .fromTransaction(bitcoin.Transaction.fromHex(unsignedTxHex), this.network)
    const keyPair = this.getKeyPair()

    for (let i = 0; i < txb.__inputs.length; i++) {
      txb.sign(i, keyPair)
    }

    return txb.build().toHex()
  }

  getKeyPair () {
    return new bitcoin.ECPair.fromPrivateKey(Buffer.from(this.privateKey, 'hex'), { network: this.network })
  }
}
