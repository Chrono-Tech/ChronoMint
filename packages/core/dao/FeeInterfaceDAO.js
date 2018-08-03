/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { FeeInterfaceABI } from './abi'
import AbstractContractDAO from './AbstractContractDAO'

export default class FeeInterfaceDAO extends AbstractContractDAO {
  constructor (at = null) {
    super(FeeInterfaceABI, at)
  }

  getFeePercent () {
    return this._call('feePercent')
  }
}
