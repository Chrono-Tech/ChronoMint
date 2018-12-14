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

  /**
   * Docs: https://github.com/trezor/connect/blob/develop/docs/methods/nemGetAddress.md
   * @param path
   * @returns {Promise<*>}
   */
  async getAddress (path) {
    console.log('getAddress: ', path)

    const result = await TrezorConnect.nemGetAddress({
      path,
      network: this.network.id,
      showOnTrezor: true,
    })
    console.log('TrezorConnect.nemGetAddress: ', result)

    if (!result.success) {
      throw new TrezorError(result.code, result.payload.error)
    }

    return result.payload.address
  }

  async signTransaction (data, path) {
    console.log('signTransaction: ', data, path)

    const result = await TrezorConnect.nemSignTransaction({
      path: path,
      transaction: data,
    })

    console.log('signTransaction result: ', result)

    return result.payload.signature
  }
}
