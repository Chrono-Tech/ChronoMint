import { KeyPair, Address } from './nem'

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
}
