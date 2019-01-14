/**
 * Copyright 2017–2019, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import AbstractContractDAO from './AbstractContractDAO'

import {
  TX_REQUIRE_TIME,
} from './constants/AssetDonatorDAO'

export default class AssetDonatorDAO extends AbstractContractDAO {
  constructor ({ address, history, abi }) {
    super({ address, history, abi })
  }

  requireTIME () {
    return this._tx(TX_REQUIRE_TIME, [])
  }

  getSymbol () {
    return 'ETH'
  }

  isTIMERequired (account): Promise {
    return this.contract.methods.timeDonations(account).call()
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
