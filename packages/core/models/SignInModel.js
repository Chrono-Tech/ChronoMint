/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import ModelBase from './ModelBase'

export default class SignInModel extends ModelBase {
  static DEFAULTS = {
    method: null,
    address: null,
    isHD: false,
    isHardware: false,
    key: '',
  }

  static METHODS = {
    PRIVATE_KEY: 'privateKey',
    MNEMONIC: 'mnemonic',
    WALLET: 'wallet',
    LEDGER: 'leger',
    TREZOR: 'trezor',
  }
}
