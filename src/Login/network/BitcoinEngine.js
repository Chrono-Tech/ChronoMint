import type BigNumber from 'bignumber.js'
import bitcoin from 'bitcoinjs-lib'
import coinselect from 'coinselect'

export const DECIMALS = 100000000
const FEE_RATE = 75 // satoshis per byte

export class BitcoinEngine {
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

  /**
   * Creates raw transaction encoded in HEX string
   * @param to Destination address
   * @param amount BTC amount in BTC with decimals
   */
  createTransaction (to, amount: BigNumber, utxos) {
    const targets = [
      {
        address: to,
        // TODO @ipavlenko: Check if the String allowed
        value: amount.mul(DECIMALS).toNumber(),
      },
    ]

    const { inputs, outputs, fee } = coinselect(utxos.map((output) => ({
      txId: output.txid,
      vout: output.vout,
      value: output.satoshis,
    })), targets, FEE_RATE)

    if (!inputs || !outputs) throw new Error('Bad transaction data')

    // Commented code exists in the example but not really
    // required for the unknown reason. Check it.

    // const pk = this._wallet.keyPair.getPublicKeyBuffer()
    // const spk = bitcoin.script.pubKey.output.encode(pk)

    const txb = new bitcoin.TransactionBuilder(this._network)
    for (const input of inputs) {
      txb.addInput(input.txId, input.vout)
      // txb.addInput(input.txId, input.vout, bitcoin.Transaction.DEFAULT_SEQUENCE, spk)
    }
    for (const output of outputs) {
      if (!output.address) {
        output.address = this.getAddress()
      }
      txb.addOutput(output.address, output.value)
    }

    this._signInputs(txb, inputs)

    return {
      tx: txb.build(),
      fee,
    }
  }
}

export class BTCEngine extends BitcoinEngine {
  constructor (wallet, network) {
    super(wallet, network)
  }

  _signInputs (txb, inputs) {
    for (let i = 0; i < inputs.length; i++) {
      txb.sign(i, this._wallet.keyPair)
    }
  }
}

export class LTCEngine extends BTCEngine {
  constructor (wallet, network) {
    super(wallet, network)
  }
}

export class BTGEngine extends BitcoinEngine {
  constructor (wallet, network) {
    super(wallet, network)
  }
}

export class BCCEngine extends BitcoinEngine {
  constructor (wallet, network) {
    super(wallet, network)
  }

  _signInputs (txb, inputs) {
    txb.enableBitcoinCash(true)
    txb.setVersion(2)

    const hashType = bitcoin.Transaction.SIGHASH_ALL | bitcoin.Transaction.SIGHASH_BITCOINCASHBIP143

    for (let i = 0; i < inputs.length; i++) {
      txb.sign(i, this._wallet.keyPair, null, hashType, inputs[ 0 ].value)
    }
  }
}
