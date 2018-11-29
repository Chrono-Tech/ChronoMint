/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import AbstractContractDAO from '../../../dao/AbstractContractDAO'

export const TX_CLOSE = 'close'
export default class AtomicSwapERC20DAO extends AbstractContractDAO {
  constructor ({ address, history, abi }) {
    super({ address, history, abi })
  }

  connect (web3, options) {
    super.connect(
      web3,
      options,
    )

    this.allEventsEmitter = this.contract.events.allEvents({}).on('data', this.handleEventsData)
  }

  disconnect () {
    if (this.isConnected) {
      this.allEventsEmitter.removeAllListeners()
      this.contract = null
      this.history = null
      this.web3 = null
    }
  }

  watchEvent (eventName, callback) {
    return this.on(eventName, callback)
  }

  check (swapId): Promise {
    return this.contract.methods.check(swapId).call()
  }

  close (swapId, secretKey) {
    return this._tx(TX_CLOSE, [swapId, secretKey])
  }
}
