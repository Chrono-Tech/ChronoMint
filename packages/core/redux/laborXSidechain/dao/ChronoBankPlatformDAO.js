/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import BigNumber from 'bignumber.js'
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

  symbols (count) {
    return this.contract.methods.symbols(count).call()
  }

  symbolsCount () {
    return this.contract.methods.symbolsCount().call()
  }

  proxies (symbol) {
    return this.contract.methods.proxies(symbol).call()
  }

  revokeAsset (symbol, value) {
    return this._tx('revokeAsset', [symbol, new BigNumber(value)])
  }
}
