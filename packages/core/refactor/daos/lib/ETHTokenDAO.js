/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import BigNumber from 'bignumber.js'
import AbstractTokenDAO from './AbstractTokenDAO'
import { TokenModel } from '../../models/index'
import ethDAO from './ETHDAO'

export default class ETHTokenDAO extends AbstractTokenDAO {
  connect (web3) {
    if (this.isConnected) {
      this.disconnect()
    }
    // eslint-disable-next-line no-console
    console.log('[ETHTokenDAO] Connect')
    this.web3 = web3
    this.txListener = this.handleTx.bind(this)
    this.subscrition = ethDAO.on('tx', this.txListener)
    this.token = new TokenModel({
      key: this.token.key,
      name: 'Labor Hour', // Hardcoded for awhile
      address: null,
      symbol: 'LHT',
      decimals: 18,
    })
    return this.token
  }

  disconnect () {
    if (this.isConnected) {
      // eslint-disable-next-line no-console
      console.log('[ETHTokenDAO] Disconnect')
      ethDAO.removeListener('tx', this.txListener)
      this.txListener = null
      this.web3 = null
    }
  }

  get isDepositSupported () {
    return false
  }

  get isWithdrawSupported () {
    return false
  }

  get isTradeSupported () {
    return false
  }

  get isTransferSupported () {
    return true
  }

  get isApproveSupported () {
    return false
  }

  get isConnected () {
    return this.web3 != null // nil check
  }

  async getBalance (address) {
    return new BigNumber(await this.web3.eth.getBalance(address))
  }

  createTransferTx (sender, recipient, amount) {
    return {
      from: sender,
      to: recipient,
      value: amount,
    }
  }

  async handleTx (tx) {
    setImmediate(() => {
      this.emit('transfer', {
        key: `${tx.hash}/tx`,
        token: this.token,
        from: tx.from,
        to: tx.to,
        value: new BigNumber(tx.value),
      })
    })
  }
}
