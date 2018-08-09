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
    console.log(`%c Contract [${this.constructor.name}] connected`, 'background: grey;', this.contract, this.address, this.history)

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
   * @param value - BigNumber | Amount
   * @param from - string
   */
  _tx (func: string, args: Array = [], value: BigNumber = new BigNumber(0), from: string) {
    const data = this.contract.methods[func](...args).encodeABI()

    if (!from) {
      from = AbstractContractDAO.getAccount()
    }

    return {
      from,
      to: this.contract._address,
      value,
      data,
    }
  }

  /**
   * Just Stub to avoid an error. Need to implement events history
   * @returns {Array}
   * @private
   */
  _get () {
    return []
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

    //eslint-disable-next-line prefer-const
    let { from, feeMultiplier, fields, symbol, id } = Object.assign({}, DEFAULT_TX_OPTIONS, options)

    if (!from) {
      from = AbstractContractDAO.getAccount()
    }

    const { gasLimit, gasFee, gasPrice } = await this.estimateGas(func, args, value, from, { feeMultiplier: feeMultiplier || 1 })

    setImmediate(async () => {
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
    if (!this.contract.methods.hasOwnProperty(func)) {
      throw new Error(`estimateGas func [${func}] not found `)
    }

    const [gasPrice, gasLimit] = await Promise.all([
      this.web3.eth.getGasPrice(),
      this.contract.methods[func](...args).estimateGas({ from, value, gas: DEFAULT_GAS }),
    ])

    const gasPriceBN = new BigNumber(gasPrice).mul(feeMultiplier)
    const gasFeeBN = gasPriceBN.mul(gasLimit)
    const gasLimitBN = new BigNumber(gasLimit)

    return { gasLimit: gasLimitBN, gasFee: gasFeeBN, gasPrice: gasPriceBN }
  }
}
