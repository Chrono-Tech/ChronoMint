/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

/* eslint-disable no-underscore-dangle */

import EventEmitter from 'events'
import BigNumber from 'bignumber.js'
import ipfs from '../utils/IPFS'
import TxExecModel from '../models/TxExecModel'
import web3Converter from '../utils/Web3Converter'
import { DEFAULT_GAS } from './constants'
import { ADD_EVENT_TO_HISTORY } from '../redux/events/constants'

import EventsService from '../services/EventsService'

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

    if (this.address) {
      this.contract = new web3.eth.Contract(this.abi.abi, this.address, options)
    }

    if (!this.history && !this.contract) {
      // eslint-disable-next-line no-console
      console.warn(`[${this.constructor.name}] history and contract is empty`)
      return
    }

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

    return {
      from: from || AbstractContractDAO.getAccount(),
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

  handleEventsData = (data) => {
    if (!data || !data.event) {
      return
    }

    EventsService.emit(ADD_EVENT_TO_HISTORY, data)
    this.emit(data.event, data)
  }

  handleEventsError = (data) => {
    if (!data.event) {
      return
    }

    this.emit(data.event + '_error', data)
  }
}
