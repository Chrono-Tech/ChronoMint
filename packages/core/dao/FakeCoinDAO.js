/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { FakeCoinABI } from './abi'
import AbstractContractDAO from './AbstractContractDAO'

class FakeCoinDAO extends AbstractContractDAO {
  constructor () {
    super(FakeCoinABI)
  }

  subscribeOnReset () {
    this._web3Provider.onResetPermanent(() => this.handleWeb3Reset())
  }

  handleWeb3Reset () {
    if (this.contract) {
      this.contract = this._initContract()
    }
  }
}

export default new FakeCoinDAO()
