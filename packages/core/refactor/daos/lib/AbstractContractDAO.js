/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import EventEmitter from 'events'
import BigNumber from 'bignumber.js'
import web3Converter from '../../../utils/Web3Converter'
import TxExecModel from '../../models/TxExecModel'
import { DEFAULT_GAS } from './ERC20TokenDAO'
import Amount from '../../../models/Amount'

export default class AbstractContractDAO extends EventEmitter {
  /**
   * @type Web3Converter
   * @protected
   */
  _c = web3Converter

  constructor ({ address, history, abi }) {
    super()
    this.address = address
    this.history = history
    this.abi = abi
  }

  connect (web3, options) {
    if (this.isConnected) {
      this.disconnect()
    }
    // eslint-disable-next-line no-console
    console.log(`[${this.constructor.name}] Connect`)
    this.contract = new web3.eth.Contract(this.abi.abi, this.address, options)
    this.history = this.history != null // nil check
      ? new web3.eth.Contract(this.abi.abi, this.history, options)
      : this.contract
  }

  get isConnected () {
    return this.contract != null
  }

  disconnect () {
    if (this.isConnected) {
      this.contract = null
      this.history = null
    }
  }

  createTransferTx (sender, recipient, amount) {
    const data = this.contract.methods.transfer(recipient, amount).encodeABI()
    return {
      from: sender,
      to: this.token.address(),
      data,
    }
  }

  createApproveTx (owner, spender, amount) {
    const data = this.contract.methods.approve(spender, amount).encodeABI()
    const tx = {
      from: owner,
      to: this.token.address(),
      data,
    }
    return tx
  }

  handleTransferData (data) {
    // eslint-disable-next-line no-console
    console.log(`[${this.constructor.name}] Transfer occurred`, data)
    const { returnValues } = data
    setImmediate(() => {
      this.emit('transfer', {
        key: `${data.transactionHash}/${data.logIndex}`,
        token: this.token,
        // eslint-disable-next-line no-underscore-dangle
        from: returnValues._from,
        // eslint-disable-next-line no-underscore-dangle
        to: returnValues._to,
        // eslint-disable-next-line no-underscore-dangle
        value: new BigNumber(returnValues._value),
      })
    })
  }

  handleTransferChanged (event) {
    // eslint-disable-next-line no-console
    console.warning(`[${this.constructor.name}] Transfer event changed`, event)
  }

  handleTransferError (error) {
    // eslint-disable-next-line no-console
    console.error(`[${this.constructor.name}] Error in Transfer event subscription`, error)
  }

  handleApprovalData (data) {
    // eslint-disable-next-line no-console
    console.log(`[${this.constructor.name}] Approve occurred`, data)
    const { returnValues } = data
    setImmediate(() => {
      this.emit('approval', {
        key: `${data.transactionHash}/${data.logIndex}`,
        token: this.token,
        // eslint-disable-next-line no-underscore-dangle
        owner: returnValues._owner,
        // eslint-disable-next-line no-underscore-dangle
        spender: returnValues._spender,
        // eslint-disable-next-line no-underscore-dangle
        value: new BigNumber(returnValues._value),
      })
    })
  }

  handleApprovalChanged (event) {
    // eslint-disable-next-line no-console
    console.warning(`[${this.constructor.name}] Approval event changed`, event)
  }

  handleApprovalError (error) {
    // eslint-disable-next-line no-console
    console.error(`[${this.constructor.name}] Error in Approval event subscription`, error)
  }

  _tx (func: string, from: string, to: string, amount: Amount, feeMultiplier: Number = 1, additionalOptions): TxExecModel {
    const data = this.contract.methods.transfer(to, amount).encodeABI()

    // eslint-disable-next-line
    console.log('Tx: ', func, from, to, this.contract)
    return new TxExecModel({
      func,
      args: [to, amount],
      from,
      to: this.contract._address,
      feeMultiplier,
      value: new BigNumber(0),
      data,
      additionalOptions,
    })
  }

  estimateGas = async (func, args, value, from, additionalOptions): Object => {
    const feeMultiplier = additionalOptions ? additionalOptions.feeMultiplier : 1

    const contract = await this.contract
    if (!contract.methods.hasOwnProperty(func)) {
      throw this._error('estimateGas func not found', func)
    }

    const [gasPrice, gasLimit] = await Promise.all([
      this.web3.eth.getGasPrice(),
      contract.methods[func](...args).estimateGas({ from, value, gas: DEFAULT_GAS }),
    ])

    const gasPriceBN = new BigNumber(gasPrice).mul(feeMultiplier)
    const gasFeeBN = gasPriceBN.mul(gasLimit)
    const gasLimitBN = new BigNumber(gasLimit)

    return { gasLimit: gasLimitBN, gasFee: gasFeeBN, gasPrice: gasPriceBN }
  }
}
