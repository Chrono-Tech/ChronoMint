/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import BigNumber from 'bignumber.js'
import AbstractContractDAO from '../../../dao/AbstractContractDAO'
import Amount from '../../../models/Amount'

export const TX_DEPOSIT = 'deposit'
export const TX_START_MINING_IN_CUSTOM_NODE = 'lockDepositAndBecomeMiner'
export const TX_WITHDRAW_SHARES = 'withdrawShares'
export const EVENT_DEPOSIT = 'Deposit'
export const EVENT_BECOME_MINER = 'BecomeMiner'
export const EVENT_WITHDRAW_SHARES = 'WithdrawShares'

export default class TimeHolderDAO extends AbstractContractDAO {
  constructor ({ address, history, abi }) {
    super({ address, history, abi })
  }

  connect (web3, options) {
    super.connect(
      web3,
      options,
    )

    this.contract.events.allEvents({})
      .on('data', this.handleEventsData)
    this.allEventsEmitter = this.history.events.allEvents({})
      .on('data', this.handleEventsData)
  }

  watchEvent (eventName, callback) {
    return this.on(eventName, callback)
  }

  disconnect () {
    if (this.isConnected) {
      this.allEventsEmitter.removeAllListeners()
      this.contract = null
      this.history = null
      this.web3 = null
    }
  }

  getMiningDepositLimits (address) {
    return this.contract.methods.getMiningDepositLimits(address).call()
  }

  deposit (tokenAddress, amount: Amount) {
    return this._tx(TX_DEPOSIT, [tokenAddress, new BigNumber(amount)])
  }

  lockDepositAndBecomeMiner (tokenAddress, amount, delegateAddress) {
    return this._tx(TX_START_MINING_IN_CUSTOM_NODE, [tokenAddress, new BigNumber(amount), delegateAddress])
  }

  getDepositBalance (tokenAddress, account) {
    return this.contract.methods.getDepositBalance(tokenAddress, account).call()
  }

  getLockedDepositBalance (tokenAddress, account) {
    return this.contract.methods.getLockedDepositBalance(tokenAddress, account).call()
  }

  withdrawShares (tokenAddress, amount) {
    return this._tx(TX_WITHDRAW_SHARES, [tokenAddress, new BigNumber(amount)])
  }
}
