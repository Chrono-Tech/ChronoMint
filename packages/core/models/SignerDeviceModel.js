/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

const SignerModel = require('./SignerModel')

module.exports = class SignerDeviceModel extends SignerModel {
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

  getAddress () {
    return this.address
  }

  getPublicKey () {
    return this.publicKey
  }

  async signTransaction (txData) { // tx object
    return this.device.signTransaction(
      this.path,
      txData
    )
  }

  async signData (data) { // tx object
    return this.device.signData(
      this.path,
      data
    )
  }

  encrypt () {
    return {
      device: this.device.name,
      path: this.path,
      address: this.address,
      publicKey: this.publicKey
    }
  }

  // Should be synchronous by design
  static async create ({ web3, device, address, path, publicKey }) {
    return new SignerDeviceModel({ device, path, address, publicKey })
  }

  // Should be synchronous by design
  static decrypt ({ web3, device, entry }) {
    const { path, address, publicKey } = entry.encrypted
    return new SignerDeviceModel({ device, path, address, publicKey })
  }
}
