/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import TrezorConnect from 'trezor-connect'
import TrezorError from '../errors/TrezorError'

export default class NemTrezorDevice {
  constructor ({ network }) {
    this.network = network
  }

  async getAddress (path) {
    const result = await TrezorConnect.nemGetAddress({
      path: path,
      network: 152,
    })
    if (!result.success) {
      throw new TrezorError(result.code, result.payload.error)
    }

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
