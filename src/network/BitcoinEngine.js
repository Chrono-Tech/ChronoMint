import bitcoin from 'bitcoinjs-lib'
import type BigNumber from 'bignumber.js'

export default class BitcoinEngine {

  constructor (wallet, providerUrl) {
    this._wallet = wallet
    this._providerUrl = providerUrl

    try { console.log('Address', this._wallet.getAddress()) } catch (e) { console.log(e) }
  }

  /**
   * Makes a transfer
   * @param to Destination address
   * @param amount BTC amount in BTC with decimals
   */
  transfer (to, amount: BigNumber) {
    var tx = new bitcoin.TransactionBuilder()

    tx.addInput('aa94ab02c182214f090e99a0d57021caffd0f195a81c24602b1028b130b63e31', 0)
    tx.addOutput(to, amount.mul(100000000).toNumber())

    // Sign the first input
    tx.sign(0, this._wallet.keyPair)
  }

  async getLastTransaction (address) {
    return Promise.resolve({
      address,
      hash: null
    })
  }
}
