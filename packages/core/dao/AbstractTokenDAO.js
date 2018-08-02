/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import Tx from 'ethereumjs-tx'
import BigNumber from 'bignumber.js'
import EventEmitter from 'events'
import { address } from '../models/validator'
import TxExecModel from '../models/TxExecModel'

export default class AbstractTokenDAO extends EventEmitter {
  constructor (token) {
    super()
    // this.setMaxListeners(100)
    this.token = token
  }

  // eslint-disable-next-line no-unused-vars
  async connect (web3, options) {
    // do nothing in basic implementation
    return this.token
  }

  disconnect () {
    // do nothing in basic implementation
  }

  addDecimals (amount) {
    return amount == null
      ? null
      : amount.multipliedBy(new BigNumber(10).pow(this.token.decimals()))
  }

  removeDecimals (amount) {
    return amount == null
      ? null
      : amount.dividedBy(new BigNumber(10).pow(this.token.decimals()))
  }

  get isDepositSupported () {
    return false
  }

  get isWithdrawSupported () {
    return false
  }

  get isConnected () {
    return false
  }

  get isTradeSupported () {
    return false
  }

  get isTransferSupported () {
    return false
  }

  get isApproveSupported () {
    return false
  }

  // eslint-disable-next-line no-unused-vars
  getAccountBalance (address) {
    throw new Error('Not implemented')
  }

  // eslint-disable-next-line no-unused-vars
  getAccountAllowance (owner, spender) {
    throw new Error('Not implemented')
  }

  // eslint-disable-next-line no-unused-vars
  createTransferTx (sender, recipient, amount) {
    throw new Error('Not implemented')
  }

  describeTx (account, abi, eth, tx, data) {
    return eth.dao.describeTx(account, abi, eth, tx, data)
  }

  getAddressValidator () {
    return address
  }

  async createRawTx (tx: TxExecModel) {
    const nonce = await this.web3.eth.getTransactionCount(tx.from)
    return new Tx({
      data: tx.data || '',
      nonce: this.web3.utils.toHex(nonce),
      gasLimit: this.web3.utils.toHex(tx.fee.gasLimit.toString()),
      gasPrice: this.web3.utils.toHex(tx.fee.gasPrice.toString()),
      to: tx.to,
      from: tx.from,
      value: this.web3.utils.toHex(tx.value.toString()),
    })
  }
}
