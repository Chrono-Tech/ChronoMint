/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { AssetDonatorABI } from './abi'
import AbstractContractDAO from './AbstractContractDAO'

export const TX_REQUIRE_TIME = 'sendTime'

class AssetDonatorDAO extends AbstractContractDAO {
  constructor () {
    super(AssetDonatorABI)
  }

  requireTIME () {
    return this._tx(TX_REQUIRE_TIME)
  }

  isTIMERequired (account): Promise {
    return this._call('timeDonations', [ account ])
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

export default new AssetDonatorDAO()
