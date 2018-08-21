/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import EventEmitter from 'events'
import bip39 from 'bip39'
import bitcoin from 'bitcoinjs-lib'
import coinselect from 'coinselect'
import TrezorConnect from 'trezor-connect';
import axios from 'axios'

export default class BitcoinTrezorDevice extends EventEmitter {
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
    const result =  await TrezorConnect.getAddress({
    path: path,
    showOnTrezor: false,
});
    console.log(result)
  return result.payload.address
  }

  async buildTx(path) {

const network = bitcoin.networks.testnet

const BLOCK_EXPLORER = axios.create({
    baseURL: 'https://middleware-bitcoin-testnet-rest.chronobank.io'
  })

const MEMORY_ADDRESS = 'mreoLKdNMwnKuGq5MPjxbWzjNuojJdHB9x'
const FROM_ADDRESS = 'mnrJYbRVUbizQL2LXsvoqZra4MMpxkRTb2'
const LEDGER_ADDRESS = 'mtnCZ2WsxjDqDzLn8EJTkQVugnbBanAhRz'

  const VALUE = 100000
  const feeRate = 200

  // ----------------------------------spend from multisig---------------------------
  const { data: utxosBE } = await BLOCK_EXPLORER.get(`/addr/${FROM_ADDRESS}/utxo`)

  const utxos = utxosBE.map(e => ({
    ...e,
    value: Number.parseInt(e.satoshis),
    txId: e.txid
  }))

  const targets = [{
      address: MEMORY_ADDRESS,
      value: VALUE
  }]

  const { inputs, outputs, fee } = coinselect(utxos, targets, feeRate)
  console.log(inputs)
  console.log(outputs)
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
  console.log(txb.buildIncomplete().toHex())

  const result =  await TrezorConnect.signTransaction({
    inputs: [
        {
            address_n: [44 | 0x80000000, 1 | 0x80000000, 0 | 0x80000000, 0, 0],
            prev_index: 0,
            prev_hash: '9ede3800025dff4fcb90360f7fab81839b0660018109302f77566d7fd649cded'
        }
    ],
    outputs: [
        {
            address: MEMORY_ADDRESS,
            amount: '100000',
            script_type: 'PAYTOADDRESS'
        },
        {
            address_n: [44 | 0x80000000, 1 | 0x80000000, 0 | 0x80000000, 0, 0],
            amount: '855000',
            script_type: 'PAYTOADDRESS'
        }, 
    ],
    coin: "Testnet"
})
   console.log(result)  

  }

  signTransaction (params) { // tx object

  }

  static async init ({ seed, network }) {
    //todo add network selector 
    
    return new BitcoinTrezorDevice({seed})

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
