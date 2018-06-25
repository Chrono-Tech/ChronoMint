/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

export default class HardwareWallet {
  constructor (address) {
    this._address = address
  }

  getAddressString () {
    return this._address
  }
}
