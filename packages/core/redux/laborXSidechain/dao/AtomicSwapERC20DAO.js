/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import AbstractContractDAO from '../../../dao/AbstractContractDAO'

export default class AtomicSwapERC20DAO extends AbstractContractDAO {
  constructor ({ address, history, abi }) {
    super({ address, history, abi })
  }

  connect (web3, options) {
    super.connect(web3, options)

    this.allEventsEmitter = this.history.events.allEvents({})
      .on('data', this.handleEventsData)
  }

  async watchEvent (eventName, callback) {
    return this.on(eventName, callback)
  }

  check (swapId): Promise {
    return this.contract.methods.check(swapId).call()
  }
}
