/**
 * Copyright 2017–2019, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { Address, PrivateKey, PublicKey} from 'litecore-lib'
import { dashProvider } from '@chronobank/login/network/DashProvider'

export default class LitecoinMemoryDevice {
  constructor ({ privateKey }) {
    this.privateKey = privateKey
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
