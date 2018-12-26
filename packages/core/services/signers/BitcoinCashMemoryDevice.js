/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import bitcoin from 'bitcoinjs-lib'

export default class BitcoinCashMemoryDevice {
  constructor ({ privateKey, network }) {
    this.privateKey = privateKey
    this.network = network
    Object.freeze(this)
  }

  getAddress () {
    const keyPair = this.getKeyPair()
    const { address } = bitcoin.payments.p2pkh({ pubkey: keyPair.publicKey, network: this.network })
    return address
  }

  signTransaction (unsignedTxHex) {
    const txb = new bitcoin.TransactionBuilder
      .fromTransaction(bitcoin.Transaction.fromHex(unsignedTxHex), this.network)
    const keyPair = this.getKeyPair()
    const hashType = bitcoin.Transaction.SIGHASH_ALL | bitcoin.Transaction.SIGHASH_BITCOINCASHBIP143

    for (let i = 0; i < txb.__inputs.length; i++) {
      txb.sign(i, keyPair, null, hashType, txb.__inputs[i])
    }

    return txb.build().toHex()
  }

  getKeyPair () {
    console.log('bitcoin.ECPair: ', bitcoin)
    return new bitcoin.ECPair.fromPrivateKey(Buffer.from(this.privateKey, 'hex'), { network: this.network })
  }
}
