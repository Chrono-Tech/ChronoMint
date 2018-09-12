/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import EventEmitter from 'events'
import * as WavesAPI from '@waves/waves-api'

export default class WavesMemoryDevice extends EventEmitter {
  constructor ({ seedPhrase, network }) {
    super()
    console.log('WavesMemoryDevice: ', seedPhrase, network)
    this.waves = WavesAPI.create(network)
    this.seed = this.waves.Seed.fromExistingPhrase('hole law front bottom then mobile fabric under horse drink other member work twenty boss')
    this.network = network
    Object.freeze(this)
  }

  getPublicKey () {
    return this.getKeyPair().publicKey.toString()
  }

  getAddress () {
    return this.seed.address
  }

  sign (unsignedTxData) {
    return unsignedTxData
  }

  getKeyPair () {
    return this.seed.keyPair
  }

  isActionRequestedModalDialogShows () {
    return false
  }
}
