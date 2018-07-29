/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import EventEmitter from 'events'
import ipfs from '@chronobank/core-dependencies/utils/IPFS'
import { ethereumProvider } from '@chronobank/login/network/EthereumProvider'
import BigNumber from 'bignumber.js'
import TxExecModel from '../../../refactor/models/TxExecModel'
import web3Converter from '../../../utils/Web3Converter'
import Amount from '../../../models/Amount'
import { BLOCKCHAIN_ETHEREUM } from '../../../dao/EthereumDAO'

export const DEFAULT_GAS = 4700000
export const DEFAULT_TX_OPTIONS = {
  feeMultiplier: null,
}

export default class AbstractContractDAO extends EventEmitter {

  /** @protected */
  static _account: string

  _c = web3Converter

  constructor ({ address, history, abi }) {
    super()
    this.address = address
    this.history = history
    this.abi = abi
  }

  connect (web3, options = {}) {
    if (this.isConnected) {
      this.disconnect()
    }
    this.web3 = web3
    options.from = AbstractContractDAO.getAccount()
    options.gas = DEFAULT_GAS

    // eslint-disable-next-line no-console
    console.log(`%c [${this.constructor.name}] Connect`, 'background: grey', options)

    this.contract = new web3.eth.Contract(this.abi.abi, this.address, options)
    // eslint-disable-next-line no-console
    console.log(`%c Contract [${this.constructor.name}] connected`, 'background: grey;', this.address)

    this.history = this.history != null // nil check
      ? new web3.eth.Contract(this.abi.abi, this.history, options)
      : this.contract
  }

  isEmptyAddress (v): boolean {
    return v === '0x0000000000000000000000000000000000000000'
  }

  static getAccount () {
    return AbstractContractDAO._account
  }

  static setAccount (account) {
    AbstractContractDAO._account = account
  }

  get isConnected () {
    return this.contract != null
  }

  disconnect () {
    if (this.isConnected) {
      this.contract = null
      this.history = null
      this.web3 = null
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

  /**
   * Send contract tx
   * @param func - string
   * @param args - Array<any>
   * @param amount - Amount
   * @param value - Amount
   * @param options - Object<any>
   * @param additionalOptions - Object<any>
   */
  _tx (
    func: string,
    args: Array = [],
    amount: BigNumber = new BigNumber(0),
    value: BigNumber = new BigNumber(0),
    options: Object = {},
    additionalOptions: Object = {},
  ): Promise {
    this.submit(func, args, amount, value, options, additionalOptions)
  }

  /**
   * @param tx - TxExecModel
   */
  accept (tx: TxExecModel) {
    setImmediate(() => {
      this.emit('accept', tx)
    })
  }

  /**
   * @param tx - TxExecModel
   */
  reject (tx: TxExecModel) {
    setImmediate(() => {
      this.emit('reject', tx)
    })
  }

  /** @protected */
  async _ipfs (bytes): any {
    return ipfs.get(this._c.bytes32ToIPFSHash(bytes))
  }

  /** @protected */
  async _ipfsPut (data): string {
    return this._c.ipfsHashToBytes32(await ipfs.put(data))
  }

  /**
   * Create tx model
   * @param func
   * @param args
   * @param amount
   * @param value
   * @param options
   * @param additionalOptions
   * @returns {Promise<TxExecModel>}
   */
  async submit (func, args, amount, value, options, additionalOptions) {
    const data = this.contract.methods[func](...args).encodeABI()

    let {
      from,
      feeMultiplier,
      fields,
      symbol,
      id,
    } = Object.assign({}, DEFAULT_TX_OPTIONS, options)

    if (!from) {
      from = AbstractContractDAO.getAccount()
    }

    const { gasLimit, gasFee, gasPrice } = await this.estimateGas(func, args, value, from, { feeMultiplier: feeMultiplier || 1 })

    setImmediate(async () => {
      console.log('submit Tx: setImmediate tx: ', this, func, args, amount, value, options, additionalOptions)
      this.emit('submit', new TxExecModel({
        _id: id,
        contract: this.abi.contractName,
        func,
        fields: fields || {},
        from,
        symbol,
        blockchain: BLOCKCHAIN_ETHEREUM,
        to: this.contract._address,
        feeMultiplier,
        value,
        data,
        fee: {
          gasLimit: new Amount(gasLimit, 'ETH'),
          gasFee: new Amount(gasFee, 'ETH'),
          gasPrice: new Amount(gasPrice, 'ETH'),
          feeMultiplier,
        },
        additionalOptions,
      }))
    })
  }

  async immediateTransfer (tx: TxExecModel) {
    try {
      return await ethereumProvider.transfer(tx, this.web3)
    } catch (e) {
      // eslint-disable-next-line
      console.log('Transfer failed', e)
      throw e
    }
  }

  estimateGas = async (func, args, value, from, additionalOptions): Object => {
    const feeMultiplier = additionalOptions && additionalOptions.feeMultiplier ? additionalOptions.feeMultiplier : 1
    // eslint-disable-next-line no-console
    const contract = await this.contract
    if (!contract.methods.hasOwnProperty(func)) {
      throw new Error('estimateGas func not found', func)
    }

    const [gasPrice, gasLimit] = await Promise.all([
      this.web3.eth.getGasPrice(),
      contract.methods[func](...args).estimateGas({ from, value, gas: 47000000 }),
    ])

    const gasPriceBN = new BigNumber(gasPrice).mul(feeMultiplier)
    const gasFeeBN = gasPriceBN.mul(gasLimit)
    const gasLimitBN = new BigNumber(gasLimit)

    return { gasLimit: gasLimitBN, gasFee: gasFeeBN, gasPrice: gasPriceBN }
  }
}
