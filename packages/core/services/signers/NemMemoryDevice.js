/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import EventEmitter from 'events'
import nem from 'nem-sdk'

export default class NemMemoryDevice extends EventEmitter {
  constructor ({seed, network}) {
    super()
    this.seed = seed
    this.keyPair = nem.crypto.keyPair.create(seed) 
    this.network = network
    Object.freeze(this)
  }

  getAddress (path) {
    return nem.model.address.toAddress(this.keyPair.seed, this.network.id)
  }

  sign (data, path) {
    return this.keyPair.sign(data)
  }


}
