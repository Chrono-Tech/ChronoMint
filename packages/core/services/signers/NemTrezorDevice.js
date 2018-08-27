/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import EventEmitter from 'events'
import nem from 'nem-sdk'
import TrezorConnect from 'trezor-connect'

export default class NemMemoryDevice extends EventEmitter {
  constructor ({seed, network}) {
    super()
    this.seed = seed
    this.network = network
    Object.freeze(this)
  }

  async getAddress (path) {
    const result = await TrezorConnect.nemGetAddress({
      path: path,
      network: this.network,
    }) 
    return result.payload.address 
  }

  async sign (data, path) {
    const result = await TrezorConnect.nemSignTransaction({       
      path: path,
      transaction: data,
    })
    return result.payload.signature
  }


}
