/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import EventEmitter from 'events'
import bip39 from 'bip39'
import bitcoin from 'bitcoinjs-lib'
import bitcore from 'bitcore-lib'
import coinselect from 'coinselect'
import TransportU2F from '@ledgerhq/hw-transport-u2f'
import AppBtc from '@ledgerhq/hw-app-btc'
import axios from 'axios'

export default class BitcoinLedgerDevice extends EventEmitter {
  constructor ({seed}) {
    super()
    this.seed = seed
    Object.freeze(this)
  }

  privateKey (path) {
    return this._getDerivedWallet(path).privateKey 
  }

  // this method is a part of base interface
  async getAddress (path) {
          const transport = await TransportU2F.create()
          const app = new AppBtc(transport)
	  const result = await app.getWalletPublicKey(path)
	  console.log(result)
          return result.bitcoinAddress	  
  }

  async buildTx(path) {

const network = bitcoin.networks.testnet

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


  console.log(utxos)

  const targets = [{
      address: MEMORY_ADDRESS,
      value: VALUE
  }]

  const { inputs, outputs, fee } = coinselect(utxos, targets, feeRate)
  console.log(inputs)
  const txb = new bitcoin.TransactionBuilder(network)
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
  const transaction = new bitcore.Transaction()
  .from(utxos)
  .to(MEMORY_ADDRESS, VALUE)
  .change('mutCF8MJqHWCYfRwnSEs1BihL5f1ZZUGnA')
  .fee(200)

  console.log(txb)
  console.log(transaction)
          const transport = await TransportU2F.create()
          const app = new AppBtc(transport)
  console.log(txb.buildIncomplete().toHex())
  console.log(transaction.uncheckedSerialize())
  //const tx1 = await app.splitTransaction(txb.buildIncomplete().toHex())
  const tx1 = await app.splitTransaction(transaction.uncheckedSerialize())
  console.log(tx1)
  const script = await app.serializeTransactionOutputs(tx1).toString('hex')
  console.log(script)
  const result = await app.createPaymentTransactionNew(
[ [tx1, 0] ],
[path],
undefined,
script
)
  console.log(result)

  }

  signTransaction (params) { // tx object

  }

  static async init ({ seed, network }) {
    //todo add network selector 
    
    return new BitcoinLedgerDevice({seed})

    } 

  _getDerivedWallet(derivedPath) {
    if(this.seed) {
      const wallet = bitcoin.HDNode
        .fromSeedBuffer(Buffer.from(this.seed.substring(2), 'hex'), bitcoin.networks.testnet)
        .derivePath(derivedPath)
      console.log(wallet)
      return wallet
    }
  }

}
