/**
 * Copyright 2017–2019, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { FeeInterfaceABI } from './abi'
import AbstractContractDAO from './AbstractContractDAO'

export default class FeeInterfaceDAO extends AbstractContractDAO {
  constructor (address, history) {
    super({ address, history, abi: FeeInterfaceABI })
  }

  connect (web3, options) {
    super.connect(web3, options)
  }

  disconnect () {
    if (this.isConnected) {
      this.allEventsEmitter.removeAllListeners()
      this.contract = null
      this.history = null
      this.web3 = null
    }
  }

  getFeePercent () {
    return this.contract.methods.feePercent().call()
  }
}
