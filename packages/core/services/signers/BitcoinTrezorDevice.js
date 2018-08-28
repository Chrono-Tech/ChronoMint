/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import EventEmitter from 'events'
import bitcoin from 'bitcoinjs-lib'
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
    return  bitcoin.HDNode
            .fromBase58(xpub, this.network)
            .derivePath(path).getAddress()
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
      delete output['address']
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
