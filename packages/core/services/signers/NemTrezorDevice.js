/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import TrezorConnect from 'trezor-connect'

export default class NemTrezorDevice {
  constructor ({ seed, network }) {
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

  async signTransaction (data, path) {
    const result = await TrezorConnect.nemSignTransaction({
      path: path,
      transaction: data,
    })

    return result.payload.signature
  }
}
