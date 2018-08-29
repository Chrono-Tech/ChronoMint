/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import EventEmitter from 'events'
import nem from 'nem-sdk'
import bitcore from 'bitcore-lib'

export default class NemMemoryDevice extends EventEmitter {
  constructor ({ seed, network }) {
    super()
    this.seed = seed
    this.network = network
    Object.freeze(this)
  }

  getAddress (path) {
    return nem.model.address.toAddress(this._getDerivedWallet(path).seed, this.network.id)
  }

  sign (data, path) {
    return this._getDerWallet(path).sign(data)
  }

  _getDerivedWallet (derivedPath) {
    if (this.seed.lengh > 64) {
      const HDPrivateKey = bitcore.HDPrivateKey

      const hdPrivateKey = new HDPrivateKey()
      // const retrieved = new HDPrivateKey(this.seed)
      const derived = hdPrivateKey.derive(derivedPath)
      return nem.crypto.keyPair.create(derived)
    }
    const PrivateKey = bitcore.PrivateKey
    const imported = PrivateKey.fromWIF(this.seed)

    return nem.crypto.keyPair.create(imported)
  }
}
