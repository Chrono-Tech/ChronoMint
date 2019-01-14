/**
 * Copyright 2017–2019, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import axios from 'axios'
import bitcoin from 'bitcoinjs-lib'
import TransportU2F from '@ledgerhq/hw-transport-u2f'
import AppBTC from '@ledgerhq/hw-app-btc'

import { EVENT_LEDGER_MODAL_SHOW, EVENT_LEDGER_MODAL_HIDE } from '../../redux/events/constants'
import EventService from '../../services/EventService'
import { BLOCKCHAIN_BITCOIN } from '../../dao/constants'

const BASE_URL = 'https://test-insight.bitpay.com/api/'

export const API = axios.create({
  baseURL: BASE_URL,
})

export default class BitcoinLedgerDevice {
  constructor ({ network }) {
    this.network = network
    Object.freeze(this)
  }

  async getAddress (path) {
    EventService.emit(EVENT_LEDGER_MODAL_SHOW, { blockchain: BLOCKCHAIN_BITCOIN })
    const transport = await TransportU2F.create()
    const app = new AppBTC(transport)
    const result = await app.getWalletPublicKey(path)
    EventService.emit(EVENT_LEDGER_MODAL_HIDE)

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
    const txb = new bitcoin.TransactionBuilder.fromTransaction(bitcoin.Transaction.fromHex(rawTx), this.network)
    const inputs = []

    const asyncForeach = async (ins, callback) => {
      for (let index = 0; index < ins.length; index++) {
        await callback(ins[index])
      }
    }
    const handleInput = async (input) => {
      const { data } = await API.get(
        `rawtx/${Buffer.from(input.hash)
          .reverse()
          .toString('hex')}`
      )
      const split = await this.splitTransaction(data.rawtx)
      inputs.push([split, input.index])
    }
    await asyncForeach(txb.buildIncomplete().ins, handleInput)

    const bufferedInput = await this.splitTransaction(rawTx)
    const outputScript = await this.serializeTransactionOutputs(bufferedInput)
    const outputScriptHex = await outputScript.toString('hex')
    const result = await this.createPaymentTransactionNew(inputs, [path], path, outputScriptHex)

    return result
  }
}
