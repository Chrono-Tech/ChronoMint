/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import bitcoin from 'bitcoinjs-lib'
import { Address, Networks, PrivateKey, PublicKey } from 'dashcore-lib'

export default class DashMemoryDevice {
  constructor ({ privateKey, network }) {
    this.privateKey = privateKey;
    this.network = network;
    Object.freeze(this);
  }

  getAddress () {
    const networkType = this.network === bitcoin.networks.testnet ? Networks.testnet : Networks.livenet;
    return new Address(PublicKey(new PrivateKey(this.privateKey)), networkType).toString();
  }

  signTransaction (tx) {
    tx.sign(new PrivateKey(this.privateKey))
  }
}
