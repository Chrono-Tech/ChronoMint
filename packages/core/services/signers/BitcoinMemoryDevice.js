/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import EventEmitter from 'events'
import bip39 from 'bip39'
import bitcoin from 'bitcoinjs-lib'

export default class BitcoinMemoryDevice extends EventEmitter {
  constructor ({seed, network}) {
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

  signTransaction (rawTx, path) { // tx object
    const txb = new bitcoin.TransactionBuilder.fromTransaction (
      bitcoin.Transaction.fromHex (txhex), this.network)
    for (let i = 0; i < txb.inputs.length; i++) {
      txb.sign(i, _getDerivedWallet(path).keyPair)
    }
    const tx = txb.build ();
    const txhex = tx.toHex ();
    return txhex
  }

  _getDerivedWallet(derivedPath) {
    if(this.seed) {
      const wallet = bitcoin.HDNode
        .fromSeedBuffer(Buffer.from(this.seed.substring(2), 'hex'), this.network)
        .derivePath(derivedPath)
      console.log(wallet)
      return wallet
    }
  }

}
