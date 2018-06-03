/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import bip39 from 'bip39'
import WavesApi from '@waves/waves-api'
import xor from 'buffer-xor'

export default class WavesWallet {
  constructor (seed, keyPair, network) {
    // TODO: NEM SDK forces us to directly use private keys in hex
    this._seed = seed
    this._keyPair = keyPair
    this._network = network
  }

  getAddress () {
    return this._seed.address//nem.model.address.toAddress(this._keyPair.publicKey.toString(), this._network.id)
  }

  getPrivateKey () {
    return this._seed.privateKey
  }

  sign (data) {
    return this._keyPair.sign(data)
  }

  static fromPrivateKey (original, network) {
    if (original.length > 64) {
      const Waves = WavesAPI.create(network);
      const seed = Waves.Seed.fromExistingPhrase(original);
      return new WavesWallet(hex, nem.crypto.keyPair.create(hex), network)
    }
    return new WavesWallet(seed, seed.keyPair), network)
  }

  static fromMnemonic (mnemonic, network) {
    // TODO @ipavlenko: Check if it possible to use long private keys with NEM SDK. Fork it if necessary.
    const original = bip39.mnemonicToSeedHex(mnemonic)
    const part1 = Buffer.from(original.substr(0, 64), 'hex')
    const part2 = Buffer.from(original.substr(64, 64), 'hex')
    const hex = xor(part1, part2).toString('hex')
    return new WavesWallet(hex, nem.crypto.keyPair.create(hex), network)
  }
}

export const signerToAddress = (signer, network) => {
  return nem.model.address.toAddress(signer, network.id)
}
