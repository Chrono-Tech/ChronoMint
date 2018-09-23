/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { getAddressByPrivateKey } from './utils';

export default class DashMemoryDevice {
  constructor ({ privateKey, network }) {
    this.privateKey = privateKey;
    this.network = network;
    Object.freeze(this);
  }

  getAddress () {
    return getAddressByPrivateKey(this.privateKey, this.network);
  }
}
