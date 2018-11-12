/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import BigNumber from 'bignumber.js'
import AbstractContractDAO from '../../../dao/AbstractContractDAO'

export default class LXValidatorManagerDAO extends AbstractContractDAO {
  constructor ({ address, history, abi }) {
    super({ address, history, abi })
  }

  connect (web3, options) {
    super.connect(
      web3,
      options
    )

    this.allEventsEmitter = this.history.events.allEvents({}).on('data', this.handleEventsData)
  }

  disconnect () {
    if (this.isConnected) {
      this.allEventsEmitter.removeAllListeners()
      this.contract = null
      this.history = null
      this.web3 = null
    }
  }

  getDefaultRewardCoefficient () {
    return this.contract.methods.DEFAULT_REWARD_COEFFICIENT().call()
  }
}
