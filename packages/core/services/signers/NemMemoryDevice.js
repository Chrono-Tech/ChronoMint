/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import nem from 'nem-sdk'
import xor from 'buffer-xor'

export default class NemMemoryDevice {
  constructor ({ privateKey, network }) {
    this.privateKey = privateKey
    this.network = network
    Object.freeze(this)
  }

  getPublicKey () {
    return this.getKeyPair().publicKey.toString()
  }

  getPrivateKey () {
    return this.privateKey
  }

  getAddress () {
    return nem.model.address.toAddress(this.getPublicKey(), this.network.id)
  }

  signTransaction (txPreparedObject) {
    const serialized = nem.utils.serialization.serializeTransaction({ ...txPreparedObject })
    return this.getKeyPair().sign(serialized)
  }

  getKeyPair () {
    if (this.privateKey.length > 64) {
      const part1 = Buffer.from(this.privateKey.substr(0, 64), 'hex')
      const part2 = Buffer.from(this.privateKey.substr(64, 64), 'hex')
      const hex = xor(part1, part2).toString('hex')
      return nem.crypto.keyPair.create(hex)
    }

    return nem.crypto.keyPair.create(this.privateKey)
  }
}
