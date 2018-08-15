/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import type BigNumber from 'bignumber.js'
import bitcoin from 'bitcoinjs-lib'
import coinselect from 'coinselect'

export const DECIMALS = 100000000

export class BitcoinEngine {
  constructor (wallet, network) {
    this._wallet = wallet // main wallet as fallback
    this._network = network
    this._walletsMap = {
      [wallet.getAddress()]: wallet,
    }
  }

  getNetwork () {
    return this._network
  }

  getAddress () {
    return this._wallet.getAddress()
  }

  getPrivateKey () {
    return this._wallet.keyPair.d.toBuffer().toString('hex')
  }

  createNewChildAddress (deriveNumber = 0, coinType) {
    const wallet = bitcoin.HDNode
      .fromSeedBuffer(this._wallet.keyPair.d.toBuffer(), this._network)
      .derivePath(`m/44'/${coinType}'/0'/0/0/${deriveNumber}`)

    this._walletsMap[wallet.getAddress()] = wallet

    return wallet
  }

  isAddressValid (address) {
    try {
      bitcoin.address.toOutputScript(address, this._network)
      return true
    } catch (e) {
      return false
    }
  }

  describeTransaction (to, amount: BigNumber, feeRate, utxos) {
    const targets = [
      {
        address: to,
        // TODO @ipavlenko: Check if the String allowed
        value: amount.toNumber(),
      },
    ]
    const { inputs, outputs, fee } = coinselect(utxos.map((output) => {
      return {
        txId: output.txid,
        vout: output.vout,
        value: Number.parseInt(output.satoshis),
      }
    }), targets, Math.ceil(feeRate))
    return { inputs, outputs, fee }
  }

  /**
   * Creates raw transaction encoded in HEX string
   * @param to Destination address
   * @param amount BTC amount in BTC with decimals
   */
  createTransaction (to, amount: BigNumber, utxos, options) {
    const { from, feeRate } = options
    const { inputs, outputs, fee } = this.describeTransaction(to, amount, feeRate, utxos)

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
        output.address = from || this.getAddress()
      }
      txb.addOutput(output.address, output.value)
    }

    this._signInputs(txb, inputs, options)

    return {
      tx: txb.build(),
      fee,
    }
  }
}

export class BTCEngine extends BitcoinEngine {
  _signInputs (txb, inputs, options) {
    const wallet = this._walletsMap[options.from] || this._wallet
    for (let i = 0; i < inputs.length; i++) {
      txb.sign(i, wallet.keyPair)
    }
  }
}

export class LTCEngine extends BTCEngine {
}

export class BTGEngine extends BitcoinEngine {
  _signInputs (txb, inputs, options) {
    txb.enableBitcoinGold(true)
    txb.setVersion(2)

    const hashType = bitcoin.Transaction.SIGHASH_ALL | bitcoin.Transaction.SIGHASH_BITCOINCASHBIP143
    const wallet = this._walletsMap[options.from] || this._wallet

    for (let i = 0; i < inputs.length; i++) {
      txb.sign(i, wallet.keyPair, null, hashType, inputs[i].value)
    }
  }
}

export class BCCEngine extends BitcoinEngine {
  _signInputs (txb, inputs, options) {
    txb.enableBitcoinCash(true)
    txb.setVersion(2)

    const hashType = bitcoin.Transaction.SIGHASH_ALL | bitcoin.Transaction.SIGHASH_BITCOINCASHBIP143
    const wallet = this._walletsMap[options.from] || this._wallet

    for (let i = 0; i < inputs.length; i++) {
      txb.sign(i, wallet.keyPair, null, hashType, inputs[i].value)
    }
  }
}
