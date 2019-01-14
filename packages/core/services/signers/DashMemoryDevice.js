/**
 * Copyright 2017–2019, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { Address, PrivateKey, PublicKey } from 'dashcore-lib'
import { dashProvider } from '@chronobank/login/network/DashProvider'

export default class DashMemoryDevice {
  constructor ({ privateKey, network }) {
    this.privateKey = privateKey
    this.network = network
    Object.freeze(this)
  }

  getPrivateKey () {
    return this.privateKey
  }

  getAddress () {
    return new Address(PublicKey(new PrivateKey(this.privateKey)), dashProvider.getNetworkType()).toString()
  }

  signTransaction (tx) {
    tx.sign(new PrivateKey(this.privateKey))
  }
}
