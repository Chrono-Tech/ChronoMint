/**
 * Copyright 2017–2019, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import bitcoin from 'bitcoinjs-lib'
import TrezorConnect from 'trezor-connect'
import { BLOCKCHAIN_BITCOIN, TESTNET } from '../../dao/constants'
import TrezorError from '../errors/TrezorError'

export default class BitcoinTrezorDevice {
  constructor ({ address, network, isTestnet }) {
    this.network = network
    this.address = address
    this.coin = isTestnet ? TESTNET : BLOCKCHAIN_BITCOIN
  }

  async getAddress (path) {
    if (!this.address) {
      const result = await TrezorConnect.getAddress({
        path: path,
        coin: this.coin,
      })
      if (!result.success) {
        throw new TrezorError(result.code, result.payload.error)
      }

      this.address = result.payload.address
    }

    return this.address
  }

  async signTransaction (unsignedTxHex, path) {

    const txb = new bitcoin.TransactionBuilder
      .fromTransaction(bitcoin.Transaction.fromHex(unsignedTxHex), this.network)
    const localAddress = await this.getAddress(path)

    if (!localAddress) {
      return
    }

    const address_n = path.split('/').map((entry) =>
      entry[entry.length - 1] === "'"
        ? parseInt(entry.substring(0, entry.length - 1)) | 0x80000000
        : parseInt(entry)
    )
    const inputs = []

    txb.buildIncomplete().ins.forEach((input) => {
      inputs.push({
        address_n: address_n,
        prev_index: input.index,
        prev_hash: Buffer.from(input.hash)
          .reverse()
          .toString('hex'),
      })
    })

    const outputs = []

    txb.buildIncomplete().outs.forEach((out) => {
      const address = bitcoin.address
        .fromOutputScript(out.script, this.network)
      let output = {
        address: address,
        amount: out.value.toString(),
        script_type: 'PAYTOADDRESS',
      }
      if (address === localAddress) {
        output = { ...output, address_n: address_n }
        delete output['address']
      }
      outputs.push(output)
    })

    const result = await TrezorConnect.signTransaction({
      inputs: inputs,
      outputs: outputs,
      coin: this.coin,
    })

    if (!result.success) {
      const { code, error } = result.payload
      throw new TrezorError(code, error)
    }

    return result.payload.serializedTx
  }
}
