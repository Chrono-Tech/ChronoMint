/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import EventEmitter from 'events'
import bip39 from 'bip39'
import bitcoin from 'bitcoinjs-lib'
import coinselect from 'coinselect'
import axios from 'axios'

export default class BitcoinMemoryDevice extends EventEmitter {
  constructor ({seed}) {
    super()
    this.seed = seed
    Object.freeze(this)
  }

  privateKey (path) {
    return this._getDerivedWallet(path).privateKey 
  }

  // this method is a part of base interface
  getAddress (path) {
    return this._getDerivedWallet(path).getAddress()
  }

  async buildTx(path) {

const network = bitcoin.networks.testnet

const BLOCK_EXPLORER = axios.create({
    baseURL: 'https://middleware-bitcoin-testnet-rest.chronobank.io'
  })

const FROM_ADDRESS = 'mreoLKdNMwnKuGq5MPjxbWzjNuojJdHB9x'
const TREZOR_ADDRESS = 'mnrJYbRVUbizQL2LXsvoqZra4MMpxkRTb2'
const LEDGER_ADDRESS = 'mtnCZ2WsxjDqDzLn8EJTkQVugnbBanAhRz'
  const VALUE = 1000000
  const feeRate = 200

  // ----------------------------------spend from multisig---------------------------
  const { data: utxosBE } = await BLOCK_EXPLORER.get(`/addr/${FROM_ADDRESS}/utxo`)

  const utxos = utxosBE.map(e => ({
    ...e,
    value: Number.parseInt(e.satoshis),
    txId: e.txid
  }))

  const targets = [{
      address: TREZOR_ADDRESS,
      value: VALUE
  }, {
      address: LEDGER_ADDRESS,
      value: VALUE
  }]

  const { inputs, outputs, fee } = coinselect(utxos, targets, feeRate)

  const txb = new bitcoin.TransactionBuilder(network)
  inputs.forEach(input => txb.addInput(input.txId, input.vout))
  outputs.forEach(output => {
    // watch out, outputs may have been added that you need to provide
    // an output address/script for
    if (!output.address) {
      output.address = FROM_ADDRESS
    }

    txb.addOutput(output.address, output.value)
  })

  // sign by platform key and 1 from secret key
  txb.sign(0, this._getDerivedWallet(path).keyPair)
  const tx = txb.build()
  console.log(tx.toHex());
  

  }

  signTransaction (params) { // tx object

  }

  static async init ({ seed, network }) {
    //todo add network selector 
    
    return new BitcoinMemoryDevice({seed})

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
