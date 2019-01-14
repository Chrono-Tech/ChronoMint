/**
 * Copyright 2017–2019, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import * as WavesAPI from '@waves/waves-api'

export default class WavesMemoryDevice {
  constructor ({ seedPhrase, network }) {
    this.waves = WavesAPI.create(network)
    this.seed = this.waves.Seed.fromExistingPhrase(seedPhrase)
    this.network = network
    Object.freeze(this)
  }

  getPublicKey () {
    return this.getKeyPair().publicKey.toString()
  }

  getPrivateKey () {
    return this.getKeyPair().privateKey
  }

  getAddress () {
    return this.seed.address
  }

  async signTransaction (unsignedTxData) {
    const transactionData = {
      ...unsignedTxData,
      senderPublicKey: this.getPublicKey()
    }

    const transferTransaction = new this.waves.Transactions.TransferTransaction(transactionData)
    const preparedTransaction = await transferTransaction.prepareForAPI(this.getKeyPair().privateKey)

    return preparedTransaction
  }

  getKeyPair () {
    return this.seed.keyPair
  }
}
