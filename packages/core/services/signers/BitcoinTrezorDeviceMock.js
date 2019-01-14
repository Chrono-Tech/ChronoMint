/**
 * Copyright 2017–2019, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import bitcoin from 'bitcoinjs-lib'
import { MOCK_PRIVATE_KEY } from './BitcoinLedgerDeviceMock'

export default class BitcoinTrezorDeviceMock {

  constructor ({ network }) {
    this.privateKey = MOCK_PRIVATE_KEY
    this.network = network
    Object.freeze(this)
  }

  getAddress () {
    const keyPair = this.getKeyPair()
    const { address } = bitcoin.payments.p2pkh({ pubkey: keyPair.publicKey, network: this.network })
    return address
  }

  async signTransaction (unsignedTxHex) {
    const txb = new bitcoin.TransactionBuilder
      .fromTransaction(bitcoin.Transaction.fromHex(unsignedTxHex), this.network)
    const keyPair = this.getKeyPair()

    for (let i = 0; i < txb.__inputs.length; i++) {
      txb.sign(i, keyPair)
    }

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(txb.build().toHex())
      }, 5000)
    })
  }

  getKeyPair () {
    return new bitcoin.ECPair.fromPrivateKey(Buffer.from(this.privateKey, 'hex'), { network: this.network })
  }
}
