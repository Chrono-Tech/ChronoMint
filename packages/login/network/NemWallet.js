import bip39 from 'bip39'
import nem from 'nem-sdk'
import xor from 'buffer-xor'

export default class NemWallet {
  constructor (privateKey, keyPair, network) {
    // TODO: NEM SDK forces us to directly use private keys in hex
    this._privateKey = privateKey
    this._keyPair = keyPair
    this._network = network
  }

  getAddress () {
    return nem.model.address.toAddress(this._keyPair.publicKey.toString(), this._network.id)
  }

  getPrivateKey () {
    return this._privateKey
  }

  sign (data) {
    return this._keyPair.sign(data)
  }

  static fromPrivateKey (hex, network) {
    return new NemWallet(hex, nem.crypto.keyPair.create(hex), network)
  }

  static fromMnemonic (mnemonic, network) {
    // TODO @ipavlenko: Check if it possible to use long private keys with NEM SDK. Fork it if necessary.
    const original = bip39.mnemonicToSeedHex(mnemonic)
    const part1 = Buffer.from(original.substr(0, 64), 'hex')
    const part2 = Buffer.from(original.substr(64, 64), 'hex')
    const hex = xor(part1, part2).toString('hex')
    return new NemWallet(hex, nem.crypto.keyPair.create(hex), network)
  }
}
