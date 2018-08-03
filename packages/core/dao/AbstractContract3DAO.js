/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import Tx from 'ethereumjs-tx'
import EventEmitter from 'events'
import ipfs from '@chronobank/core-dependencies/utils/IPFS'
import { ethereumProvider } from '@chronobank/login/network/EthereumProvider'
import BigNumber from 'bignumber.js'
import TxExecModel from '../models/TxExecModel'
import web3Converter from '../utils/Web3Converter'
import Amount from '../models/Amount'

//#region CONSTANTS

import {
  BLOCKCHAIN_ETHEREUM,
  DEFAULT_GAS,
  DEFAULT_TX_OPTIONS,
} from './constants'

//#endregion CONSTANTS

export default class AbstractContractDAO extends EventEmitter {

  /** @protected */
  static _account: string

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
    console.log(`%c Contract [${this.constructor.name}] connected`, 'background: grey;', this.contract, this.address, this.history, )

    this.history = this.history != null
      ? new web3.eth.Contract(this.abi.abi, this.history, options)
      : this.contract
  }

  getContractName () {
    return this.abi.contractName
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
    console.log('Abstract _tx: ', func, args, amount, value, options, additionalOptions)
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
    return ipfs.get(web3Converter.bytes32ToIPFSHash(bytes))
  }

  /** @protected */
  async _ipfsPut (data): string {
    return web3Converter.ipfsHashToBytes32(await ipfs.put(data))
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
    console.log('gasLimit, gasFee, gasPrice before: ', func, args, value, from)

    const { gasLimit, gasFee, gasPrice } = await this.estimateGas(func, args, value, from, { feeMultiplier: feeMultiplier || 1 })

    console.log('gasLimit, gasFee, gasPrice: ', gasLimit, gasFee, gasPrice)

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
      const rawTx = await this.createRawTx(tx)
      ethereumProvider.transfer(rawTx, tx.from)
    } catch (e) {
      // eslint-disable-next-line
      console.log('Transfer failed', e)
      throw e
    }
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
