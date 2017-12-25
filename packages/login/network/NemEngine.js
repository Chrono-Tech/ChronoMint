import type BigNumber from 'bignumber.js'

export class NemEngine {
  constructor (wallet, network) {
    this._wallet = wallet
    this._network = network
  }

  getNetwork () {
    return this._network
  }

  getAddress () {
    return this._wallet.getAddress()
  }

  createTransaction (to, amount: BigNumber, feeRate, utxos) {
    // TODO @ipavlenko: Implement, return { tx, fee }, tx should have toHex method
    // return { tx, fee }
    throw new Error('Not implemened. Method: createTransaction. Args:', to, amount, feeRate, utxos)
  }
}
