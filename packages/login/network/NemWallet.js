import bip39 from 'bip39'
import xor from 'buffer-xor'
import { KeyPair, Address } from './nem/index'

export default class NemWallet {
  constructor (keyPair, network) {
    this._keyPair = keyPair
    this._network = network
  }

  getAddress () {
    return Address.toAddress(this._keyPair.publicKey.toString(), this._network.id)
  }

  static fromPrivateKey (hex, network) {
    return new NemWallet(KeyPair.create(hex), network)
  }

  static fromMnemonic (mnemonic, network) {
    const original = bip39.mnemonicToSeedHex(mnemonic)
    const part1 = Buffer.from(original.substr(0, 64), 'hex')
    const part2 = Buffer.from(original.substr(64, 64), 'hex')
    const hex = xor(part1, part2).toString('hex')
    return new NemWallet(KeyPair.create(hex), network)
  }
}
