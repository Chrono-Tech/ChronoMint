/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import * as WavesAPI from '@waves/waves-api'

export default class WavesWallet {
  constructor (seed, keyPair, network) {
    this._seed = seed
    this._keyPair = keyPair
    this._network = network
  }

  getAddress () {
    console.log('Waves address:')
    console.log(this._seed.address)
    return this._seed.address
  }

  getPrivateKey () {
    return this._seed.privateKey
  }

  static fromPrivateKey (original, network) {
    const Waves = WavesAPI.create(network)
    const seed = Waves.Seed.fromExistingPhrase(original)
    return new WavesWallet((seed, seed.keyPair), network)
  }

  static fromMnemonic (mnemonic, network) {
    const Waves = WavesAPI.create(network)
    const seed = Waves.Seed.fromExistingPhrase(mnemonic)
    return new WavesWallet(seed, seed.keyPair, network)
  }
}

//export const signerToAddress = (signer, network) => {
//  return nem.model.address.toAddress(signer, network.id)
//}
