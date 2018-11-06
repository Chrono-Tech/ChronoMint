/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import bitcoin from 'bitcoinjs-lib'
import TransportU2F from '@ledgerhq/hw-transport-u2f'
import AppBTC from '@ledgerhq/hw-app-btc'
import axios from 'axios'

const BASE_URL = 'https://test-insight.bitpay.com/api/'

export const API = axios.create({
  baseURL: BASE_URL,
})

export default class BitcoinLedgerDevice {
  constructor ({ network }) {
    this.network = network
    Object.freeze(this)
  }

  // this method is a part of base interface
  async getAddress (path) {
    const transport = await TransportU2F.create()
    const app = new AppBTC(transport)
    const result = await app.getWalletPublicKey(path)

    return result.bitcoinAddress
  }

  async serializeTransactionOutputs (...args) {
    const transport = await TransportU2F.create()
    const app = new AppBTC(transport)

    return app.serializeTransactionOutputs(...args)
  }

  async splitTransaction (...args) {
    const transport = await TransportU2F.create()
    const app = new AppBTC(transport)

    return app.splitTransaction(...args)
  }

  async createPaymentTransactionNew (...args) {
    const transport = await TransportU2F.create()
    transport.setDebugMode(true)
    const app = new AppBTC(transport)

    return app.createPaymentTransactionNew(...args)
  }

  async signTransaction (rawTx, path) {
    // tx object
    const txb = new bitcoin.TransactionBuilder.fromTransaction(bitcoin.Transaction.fromHex(rawTx), this.network)

    const inputs = []

    await txb.buildIncomplete().ins.forEach(async (input) => {
      const { data } = await API.get(
        `rawtx/${Buffer.from(input.hash)
          .reverse()
          .toString('hex')}`
      )
      inputs.push([await this.splitTransaction(data.rawtx), input.index])
    })

    const bufferedInput = await this.splitTransaction(rawTx)
    const outputScript = await this.serializeTransactionOutputs(bufferedInput)
    const outputScriptHex = await outputScript.toString('hex')
    const result = await this.createPaymentTransactionNew(inputs, [path], path, outputScriptHex)

    return result
  }
}
