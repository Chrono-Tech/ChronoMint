/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import SignerModel from './SignerModel'

export default class SignerDeviceModel extends SignerModel {
  constructor ({ device, path, address, publicKey }) {
    super()
    this.device = device
    this.path = path
    this.address = address
    this.publicKey = publicKey
    Object.freeze(this)
  }

  getDevice () {
    return this.device
  }

  getAddress (path) {
    if (path) {
      return device.getAddress(path)
    } else { 
      return this.address
    }
  }

  getPublicKey () {
    return this.publicKey
  }

  async signTransaction (txData, path) { // tx object
    let pth
    if(path) {
      pth = path
    } else {
      pth = this.path
    }
    return this.device.signTransaction(
      pth,
      txData,
    )
  }

  async signData (data, path) { // tx object
    let pth
    if(path) {
      pth = path
    } else {
      pth = this.path
    }
    return this.device.signData(
      pth,
      data,
    )
  }

  encrypt () {
    return {
      device: this.device.name,
      path: this.path,
      address: this.address,
      publicKey: this.publicKey,
    }
  }

  // Should be synchronous by design
  static async create ({ device, address, path, publicKey }) {
  //eslint-disable-next-line no-unused-vars
    return new SignerDeviceModel({ device, path, address, publicKey })
  }

  // Should be synchronous by design
  static decrypt ({ device, entry }) {
    const { path, address, publicKey } = entry.encrypted[0]
    return new SignerDeviceModel({ device, path, address: `0x${address}`, publicKey })
  }
}
