/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import EventEmitter from 'events'
import bip39 from 'bip39'
import bitcoin from 'bitcoinjs-lib'
import coinselect from 'coinselect'
import TransportU2F from '@ledgerhq/hw-transport-u2f'
import AppBtc from '@ledgerhq/hw-app-btc'
import axios from 'axios'

export const API = axios.create({
  baseURL: 'https://test-insight.bitpay.com/api/'
})

export default class BitcoinLedgerDevice extends EventEmitter {
  constructor ({network}) {
    super()
    this.network = network
    Object.freeze(this)
  }

  // this method is a part of base interface
  async getAddress (path) {
    const transport = await TransportU2F.create()
    const app = new AppBtc(transport)
    const result = await app.getWalletPublicKey(path)
    return result.bitcoinAddress	  
  }

  async serializeTransactionOutputs (...args) {
    return this._safeExec(
      async () => {
        const transport = await TransportU2F.create()
        const app = new AppBTC(transport)
        return app.serializeTransactionOutputs(...args)
      }
    )
  }

  async splitTransaction (...args) {
    return this._safeExec(
      async () => {
        const transport = await TransportU2F.create()
        const app = new AppBTC(transport)
        return app.splitTransaction(...args)
      }
    )
  }

  async createPaymentTransactionNew (...args) {
    return this._safeExec(
      async () => {
        const transport = await TransportU2F.create()
        transport.setDebugMode(true)
        const app = new AppBTC(transport)
        return app.createPaymentTransactionNew(...args)
      }
    )
  }
	
  async _safeExec (callable) {
    return this.lock.acquire(
      LOCK,
      callable
    )
  }

  async buildTx(path) {

const BLOCK_EXPLORER = axios.create({
    baseURL: 'https://testnet.blockexplorer.com/'
  })

const MEMORY_ADDRESS = 'mreoLKdNMwnKuGq5MPjxbWzjNuojJdHB9x'
const TREZOR_ADDRESS = 'mnrJYbRVUbizQL2LXsvoqZra4MMpxkRTb2'
const FROM_ADDRESS = 'mtnCZ2WsxjDqDzLn8EJTkQVugnbBanAhRz'

  const VALUE = 100000
  const feeRate = 200

  // ----------------------------------spend from multisig---------------------------
  const { data: utxosBE } = await BLOCK_EXPLORER.get(`/api/addr/${FROM_ADDRESS}/utxo`)
  console.log(utxosBE)

  const utxos = utxosBE.map(e => ({
    ...e,
    value: e.satoshis,
    txId: e.txid,
    address: '',
    outputIndex: e.vout
  }))

  const targets = [{
      address: MEMORY_ADDRESS,
      value: VALUE
  }]

  const { inputs, outputs, fee } = coinselect(utxos, targets, feeRate)
  const txb = new bitcoin.TransactionBuilder(this.network)
  txb.setVersion(1)
  inputs.forEach(input => txb.addInput(input.txId, input.vout))
  outputs.forEach(output => {
    // watch out, outputs may have been added that you need to provide
    // an output address/script for
    if (!output.address) {
      output.address = 'mutCF8MJqHWCYfRwnSEs1BihL5f1ZZUGnA'
    }

    txb.addOutput(output.address, output.value)
  })
	
  this.signTransaction(txb.buildIncomplete().toHex(), path)

  }

  signTransaction (rawTx, path) { // tx object
    const txb = new bitcoin.TransactionBuilder.fromTransaction (
        bitcoin.Transaction.fromHex (rawTx), this.network)

    let inputs = []

    txb.buildIncomplete().ins.forEach((input) => {
      const { data } = await API.get(`rawtx/${Buffer.from(input.hash).reverse().toString('hex')}`)
      inputs.push([this.splitTransaction(data.rawtx), input.index])
    })
    const bufferedInput = await this.splitTransaction(rawTx)
    const outputScript = await this.serializeTransactionOutputs(bufferedInput)
    const outputScriptHex = await outputScript.toString("hex")
    const result = await this
      .createPaymentTransactionNew(
      inputs,
      [path],
      path,
      outputScriptHex
      )
  }

}
