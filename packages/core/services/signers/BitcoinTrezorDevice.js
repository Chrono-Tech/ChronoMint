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
  constructor ({xpub, network}) {
    super()
    this.xpub = xpub
    this.network = network
    Object.freeze(this)
  }

  // this method is a part of base interface
  getAddress (path) {
    return  "mnrJYbRVUbizQL2LXsvoqZra4MMpxkRTb2"//bitcoin.HDNode
            //.fromBase58(xpub, this.network)
            //.derivePath(path).getAddress()
  }

  async buildTx(path) {


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
  const txb = new bitcoin.TransactionBuilder(this.network)
  inputs.forEach(input => txb.addInput(input.txId, input.vout))
  outputs.forEach(output => {
    // watch out, outputs may have been added that you need to provide
    // an output address/script for
    if (!output.address) {
      output.address = FROM_ADDRESS
    }

    txb.addOutput(output.address, output.value)
  })
  console.log(txb)
  this.signTransaction(txb.buildIncomplete().toHex(), path)

  }

  async signTransaction (rawTx, path) { // tx object
    const txb = new bitcoin.TransactionBuilder.fromTransaction (
	bitcoin.Transaction.fromHex (rawTx), this.network)

    const localAddress = this.getAddress(path)

    if(!localAddress) {
      return
    }

    const address_n = path.split('/').map(entry => entry[entry.length-1] === "'"
      ? parseInt(entry.substring(0, entry.length - 1)) | 0x80000000
      : parseInt(entry)
    )

    let inputs = []

    txb.buildIncomplete().ins.forEach((input) => {
      inputs.push({ address_n: address_n,
	prev_index: input.index,
	prev_hash: Buffer.from(input.hash).reverse().toString('hex'),
      })
    })

    let outputs = []

    txb.buildIncomplete().outs.forEach((out) => {
    const address = bitcoin.address.fromOutputScript(out.script, this.network)
    let output = { address: address,
                   amount: out.value.toString(),
	           script_type: 'PAYTOADDRESS',
                 }
    if (address == localAddress) {
      output = { ...output, address_n: address_n }
    }
    outputs.push(output)
    })

    console.log(inputs)
    console.log(outputs)

    const result =  await TrezorConnect.signTransaction({
      inputs: inputs,
      outputs: outputs,
      coin: "Testnet"
    })

    console.log(result)

  }

}
