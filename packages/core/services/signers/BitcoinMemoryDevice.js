/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import EventEmitter from 'events'
import bip39 from 'bip39'
import bitcoin from 'bitcoinjs-lib'

export default class BitcoinMemoryDevice extends EventEmitter {
  constructor ({ network, seed }) {
    super()
    console.log(network)
    this.network = network
    this.seed = seed
    Object.freeze(this)
  }

  privateKey (path) {
    return _getDerivedWallet(path).privateKey 
  }

  // this method is a part of base interface
  getAddress (path) {
    return _getDerivedWallet(path).address
  }

  async signTransaction (params) { // tx object
    const txb = new bitcoin.TransactionBuilder(this._network)
    params.inputs.forEach((item) => {
      txb.addInput(getAddressitem.address, item.value)
    })
    params.outputs.forEach((item) => {
      txb.addOutput(getAddress(item.path), item.value)
      txb.sign(getAddress(path),privateKey(path))
    })
    
    return txb.build().toHex()
  }

  static async init ({ seed, network }) {
    //todo add network selector
    return new BitcoinMemoryDevice({seed, network: bitcoin.networks.mainnet})

    } 

  _getDerivedWallet(derivedPath) {
    if(this.seed) {
      const wallet = bitcoin.HDNode
        .fromSeedBuffer(this.seed, this.network)
        .derivePath(derivedPath)
      return wallet
    }
  }

}
