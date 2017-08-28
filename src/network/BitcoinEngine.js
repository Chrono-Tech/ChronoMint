import bitcoin from 'bitcoinjs-lib'
import coinselect from 'coinselect'
import type BigNumber from 'bignumber.js'

const DECIMALS = 100000000
const FEE_RATE = 55 // satoshis per byte


export default class BitcoinEngine {

  constructor (wallet, providerUrl) {
    this._wallet = wallet
    this._providerUrl = providerUrl
    try { console.log('Address', this._wallet.getAddress()) } catch (e) { console.log(e) }
  }

  getAddress () {
    return this._wallet.getAddress()
  }

  handleTransaction (tx) {
    console.log(tx)
  }

  /**
   * Creates raw transaction encoded in HEX string
   * @param to Destination address
   * @param amount BTC amount in BTC with decimals
   */
  createTransaction (to, amount: BigNumber, utxos) {

    let targets = [
      {
        address: to,
        // TODO @ipavlenko: Check if the String allowed
        value: amount.mul(DECIMALS).toNumber()
      }
    ]

    const { inputs, outputs, fee } = coinselect(utxos, targets, FEE_RATE)

    if (!inputs || !outputs) return

    const txb = new bitcoin.TransactionBuilder()
    for (const input of inputs) {
      txb.addInput(input.txId, input.vout)
    }
    for (const output of outputs) {
      if (!output.address) {
        output.address = this._wallet.getChangeAddress()
      }
      txb.addOutput(output.address, output.value)
    }
    for (let i = 0; i < inputs.length; i++) {
      txb.sign(i, this._wallet.keyPair)
    }

    return {
      tx: txb.build(),
      fee
    }
  }
}
