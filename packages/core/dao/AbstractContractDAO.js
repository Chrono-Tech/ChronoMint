/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import BigNumber from 'bignumber.js'
import resultCodes from 'chronobank-smart-contracts/common/errors'
import truffleContract from 'truffle-contract'
import ipfs from '@chronobank/core-dependencies/utils/IPFS'
import EventEmitter from 'events'
import web3Provider from '@chronobank/login/network/Web3Provider'
import validator from '../models/validator'
import AbstractModel from '../models/AbstractModelOld'
import TxError from '../models/TxError'
import TxExecModel from '../models/TxExecModel'
import web3Converter from '../utils/Web3Converter'

//#region CONSTANTS

import {
  DEFAULT_TX_OPTIONS,
  TX_FRONTEND_ERROR_CODES,
  DEFAULT_GAS,
} from './constants'

//#endregion CONSTANTS

const DEFAULT_OK_CODES = [resultCodes.OK, true]
const FILTER_BLOCK_STEP = 100000 // 5 (5 sec./block) - 18 days (15 sec./block respectively) per request

const DEFAULT_ERROR_CODES = {
  ...resultCodes,
  ...TX_FRONTEND_ERROR_CODES,
}

export default class AbstractContractDAO extends EventEmitter {
  /**
   * @type Web3Converter
   * @protected
   */
  _c = web3Converter

  /** @protected */
  static _account: string

  /**
   * @type {number} To prevent callback execution for old events.
   * @protected
   */
  static _eventsWatchStartTime = Date.now()

  /**
   * Collection of all blockchain events to stop watching all of them via only one call of...
   * @see AbstractContractDAO.stopWholeWatching
   * @private
   */
  static _events = {}

  /** @private */
  static _eventsContracts = []

  /** @private */
  static _filterCache = {}

  constructor (json = null, at = null, eventsJSON = null) {
    super()
    if (new.target === AbstractContractDAO) {
      throw new TypeError('Cannot construct AbstractContractDAO instance directly')
    }
    this._json = json
    this._at = at
    this._eventsJSON = eventsJSON || json
    this._eventsContract = null
    this._okCodes = DEFAULT_OK_CODES
    this._errorCodes = DEFAULT_ERROR_CODES

    Object.defineProperty(this, '_web3Provider', {
      value: web3Provider,
      enumerable: false,
    })

    if (json) {
      this.contract = this._initContract()
      this.contract.catch(() => false)
    }

    this._web3Provider.onResetPermanent(() => this._handleWeb3Reset())
    this.subscribeOnReset()

    this._uniqId = `${this.constructor.name}-${Math.random()}`
    AbstractContractDAO._events[this._uniqId] = []
    AbstractContractDAO._filterCache[this._uniqId] = {}
  }

  subscribeOnReset () {
    this._web3Provider.onReset(() => this.handleWeb3Reset())
  }

  static setup (userAccount: string) {
    AbstractContractDAO._account = userAccount
  }

  getAccount () {
    return AbstractContractDAO._account
  }

  setAccount (account) {
    AbstractContractDAO._account = account
  }

  _handleWeb3Reset () {
    this._at = null
  }

  // Call anly for singleton contracts
  handleWeb3Reset () {
    // Should update contract if the contract is singleton.
    // Should dispose contract resources and subscriptions in other case.
  }

  isAddress (address) {
    return /^0x[0-9a-f]{40}$/i.test(address)
  }

  /** @private  TODO @bshevchenko: get rid of "noinspection JSUnresolvedFunction" */
  async _initContract (web3 = null) {
    if (this._at !== null && validator.address(this._at) !== null) {
      throw new Error(`invalid address passed: ${this._at}`)
    }
    try {
      web3 = web3 || await this._web3Provider.getWeb3()

      const contract = truffleContract(this._json)
      // noinspection JSUnresolvedFunction
      contract.setProvider(web3.currentProvider)
      // noinspection JSUnresolvedFunction
      await contract.detectNetwork()
      contract.address = this._at || contract.address
      // noinspection JSUnresolvedFunction
      const deployed = await contract.deployed()

      this._at = deployed.address
      if (this._eventsJSON && !this._eventsContract && this._eventsJSON !== this._json) {
        let eventsAddress
        const key = web3.sha3(this._eventsJSON)
        if (AbstractContractDAO._eventsContracts.hasOwnProperty(key)) {
          eventsAddress = AbstractContractDAO._eventsContracts[key]
        } else {
          const events = truffleContract(this._eventsJSON)
          // noinspection JSUnresolvedFunction
          events.setProvider(web3.currentProvider)
          // noinspection JSUnresolvedFunction
          const deployedEvents = await events.deployed()
          eventsAddress = deployedEvents.address
          AbstractContractDAO._eventsContracts[key] = eventsAddress
        }

        const eventsContract = truffleContract(this._json)
        // noinspection JSUnresolvedFunction
        eventsContract.setProvider(web3.currentProvider)
        // noinspection JSUnresolvedFunction
        await eventsContract.detectNetwork()
        eventsContract.address = eventsAddress

        // noinspection JSUnresolvedFunction
        this._eventsContract = eventsContract.deployed()
      }

      this._eventsContract = this._eventsContract || Promise.resolve(deployed)

      return deployed
    } catch (e) {
      console.log(`${this.getContractName()}#_initContract error: ${e.message}`) // eslint-disable-line no-console
      return false
    }
  }

  async getCode (address, block = 'latest', web3Provider = this._web3Provider): ?string {
    const code = await web3Provider.getCode(address, block)
    if (!code || /^0x[0]?$/.test(code)) {
      return null
    }
    return code
  }

  // TODO @bshevchenko: MINT-313 isDeployed (checkCodeConsistency = true): bool {
  async isDeployed (web3Provider = this._web3Provider): boolean {
    try {
      await this._initContract(web3Provider.getWeb3instance())
      const code = await this.getCode(this.getInitAddress(), 'latest', web3Provider)
      if (!code) {
        throw new Error(`${this.getContractName()} isDeployed code is empty, address: ${this.getInitAddress()}`)
      }
      // TODO @bshevchenko: code is different from json.unlinked_binary when contract using libraries
      // if (checkCodeConsistency && code !== this._json.unlinked_binary) {
      //   resolve(new Error('isDeployed check code consistency failed'))
      // }
      return true
    } catch (e) {
      // eslint-disable-next-line
      console.warn(this.getContractName(), 'Deployed error', e.message)
      return false
    }
  }

  async getAddress (): Promise {
    return this._at || this.contract.then((i) => i.address)
  }

  getInitAddress () {
    return this._at
  }

  getContractName () {
    return this._json.contractName
  }

  async getData (func: string, args: Array = []): string {
    const deployed = await this.contract
    if (!deployed.contract.hasOwnProperty(func)) {
      throw new Error(`unknown function '${func}' in contract '${this.getContractName()}'`)
    }
    return deployed.contract[func].getData.apply(null, args)
  }

  /** @protected */
  async _ipfs (bytes): any {
    return ipfs.get(this._c.bytes32ToIPFSHash(bytes))
  }

  /** @protected */
  async _ipfsPut (data): string {
    return this._c.ipfsHashToBytes32(await ipfs.put(data))
  }

  /** @protected */
  async _call (func, args: Array = []): any {
    const deployed = await this.contract
    if (!deployed.hasOwnProperty(func)) {
      throw new Error(`unknown function '${func}' in contract '${this.getContractName()}'`)
    }
    try {
      const from = this.getAccount()
      return deployed[func].call(...args, {
        from,
        gas: DEFAULT_GAS,
      })
    } catch (e) {
      throw this._error('_call error', func, args, null, null, e)
    }
  }

  /** Use this when you don't need BigNumber */
  async _callNum (func, args: Array = []): number {
    const r = await this._call(func, args)
    return r.toNumber()
  }

  async _callArray (): Array {
    const result = await this._call(...arguments)
    return result instanceof Array ? result : [result]
  }

  async _callDate (): Date {
    const date = await this._callNum(...arguments) * 1000
    return new Date(date)
  }

  isEmptyAddress (v): boolean {
    return v === '0x0000000000000000000000000000000000000000'
  }

  /**
   * Call this function before transaction
   * @see _tx
   * @see EthereumDAO.transfer
   * @throws TxError
   */ // eslint-disable-next-line
  static txStart = async (tx: TxExecModel, estimateGas, feeMultiplier = 1) => {
    const { gasFee, gasLimit } = await estimateGas(tx.funcName(), tx.params(), tx.value())
    return tx.setGas(gasFee.mul(feeMultiplier)).gasLimit(gasLimit)
  }

  /**
   * Call this function after estimate gas to set tx gas fee
   * @param tx
   */ // eslint-disable-next-line
  static txGas = (tx: TxExecModel) => {
  }

  /**
   * Call this function after transaction
   */ // eslint-disable-next-line
  static txEnd = (tx: TxExecModel, e: TxError = null) => {
  }

  /**
   * Returns function exec args associated with names from contract ABI
   * @param func
   * @param args
   * @private
   */
  _argsWithNames (func: string, args: Array = []): Object {
    let r = null
    for (const i in this._json.abi) {
      if (this._json.abi.hasOwnProperty(i) && this._json.abi[i].name === func) {
        const inputs = this._json.abi[i].inputs
        if (!r) {
          r = {}
        }
        for (const j in inputs) {
          if (inputs.hasOwnProperty(j)) {
            if (!args.hasOwnProperty(j)) {
              throw new Error(`invalid argument ${j}`)
            }
            r[inputs[j].name] = args[j]
          }
        }
        break
      }
    }
    if (!r) {
      throw new Error('argsWithNames should not be null')
    }
    return r
  }

  /** @private */
  _error (msg, func, args, value, gas, e: ?Error | TxError): Error {
    if (typeof args === 'object') {
      const newArgs = []
      for (const i in args) {
        if (args.hasOwnProperty(i)) {
          newArgs.push(`${i}=${args[i]}`)
        }
      }
      args = newArgs
    }

    const code = e && e.code ? `, code ${e.code}` : ''

    return new Error(`${msg}; ${this.getContractName()}.${func}(${args && args.toString() || 'undefined'}):${
      value} [${gas}] ${e ? (e.message + code) : ''}`)
  }

  /**
   * Receives Error from web3 and returns TxError with corresponding error code from...
   * @see TX_FRONTEND_ERROR_CODES
   * @protected
   */
  _txErrorDefiner (error): TxError {
    if (typeof error.code === 'boolean') {
      // TODO @dkchv: 'false' may be from contract too
      error.code = error.code ? TX_FRONTEND_ERROR_CODES.FRONTEND_RESULT_TRUE : TX_FRONTEND_ERROR_CODES.FRONTEND_RESULT_FALSE
    }

    if (typeof error.code === 'undefined') {
      let code = TX_FRONTEND_ERROR_CODES.FRONTEND_UNKNOWN

      if (error.message && error.message.includes('User denied')) { // Metamask
        code = TX_FRONTEND_ERROR_CODES.FRONTEND_CANCELLED
      }

      // TODO @bshevchenko: end up this function with the rest of errors
      // eslint-disable-next-line
      console.error('Undefined error, handle it inside of the _txErrorDefiner', error.message, 'stack', error.stack)

      error.code = code
    }

    const codeValue = error.code

    for (const [k, v] of Object.entries(this._errorCodes)) {
      if (error.code === v) {
        error.code = k
      }
    }

    return new TxError(error.message, error.code, codeValue)
  }

  /**
   * @param func
   * @param args
   * @param infoArgs key-value pairs to display in pending transactions list. If this param is empty, then it will be
   * filled with arguments names from contract ABI as a keys, args values as a values.
   * You can also pass here model, then this param will be filled with result of...
   * @see AbstractModel.summary
   * Keys is using for I18N
   * @param value
   * @param options
   * @returns {Promise<Object>} receipt
   * @protected
   */
  // eslint-disable-next-line complexity
  async _tx (func: string,
             args: Array = [],
             infoArgs: Object | AbstractModel = null,
             value: BigNumber = new BigNumber(0),
             options = DEFAULT_TX_OPTIONS): Object {

    const {
      from,
      addDryRunFrom,
      addDryRunOkCodes,
      allowNoReturn,
      useDefaultGasLimit,
      additionalAction,
      feeMultiplier,
      advancedOptions = undefined,
    } = Object.assign({}, DEFAULT_TX_OPTIONS, options)

    const deployed = await this.contract
    if (!deployed.hasOwnProperty(func)) {
      throw this._error('_tx func not found', func)
    }

    const displayArgs = infoArgs
      ? (typeof infoArgs.txSummary === 'function' ? infoArgs.txSummary() : infoArgs)
      : this._argsWithNames(func, args)

    const advancedParams = advancedOptions && typeof advancedOptions === 'object' ? advancedOptions : {}

    let tx = new TxExecModel({
      contract: this.getContractName(),
      func,
      args: displayArgs,
      value,
      additionalAction,
      params: args,
      options: {
        advancedParams: advancedParams,
      },
    })

    let gasLimit = null

    /** START */
    try {
      tx = await AbstractContractDAO.txStart(tx, this.estimateGas, feeMultiplier)
      gasLimit = tx.gasLimit()
      args = tx.params()

      const txParams = {
        from: from || this.getAccount(),
        value,
        gas: useDefaultGasLimit ? DEFAULT_GAS : gasLimit,
        gasPrice: tx.gasPrice(),
      }

      /** DRY RUN */
      const convertDryResult = (r) => {
        try {
          return typeof r !== 'boolean' ? r.toNumber() : r
        } catch (e) {
          // eslint-disable-next-line
          console.error('Int or boolean result code was expected, received:', r)
          return TX_FRONTEND_ERROR_CODES.FRONTEND_INVALID_RESULT
        }
      }

      if (addDryRunFrom) {
        const addDryResult = convertDryResult(await deployed[func].call(...args, {
          ...txParams,
          from: addDryRunFrom,
        }))
        if (!addDryRunOkCodes.includes(addDryResult)) {
          throw new TxError('Additional dry run failed', addDryResult)
        }
      }

      if (!allowNoReturn) {
        const dryResult = await deployed[func].call(...args, txParams)
        const convertedDryResult = convertDryResult(dryResult)
        if (!this._okCodes.includes(convertedDryResult)) {
          throw new TxError('Dry run failed', convertedDryResult)
        }
      }

      if (process.env.NODE_ENV === 'development') {
        // for debug
        // eslint-disable-next-line
        console.log(`%c --> ${this.getContractName()}.${func}`, 'color: #fff; background: #906', args)
      }

      const result = await deployed[func](...args, txParams)

      tx = tx.set('hash', result.tx || 'unknown hash')

      /** OUT OF GAS ERROR HANDLING WHEN TX WAS ALREADY MINED */
      if (typeof result === 'object' && result.hasOwnProperty('receipt')) {
        const gasPrice = new BigNumber(await this._web3Provider.getGasPrice())
        tx = tx.setGas(gasPrice.mul(result.receipt.gasUsed), true)

        if (tx.estimateGasLaxity().gt(0)) {
          // uncomment line below if you want to log estimate gas laxity
          // console.warn(this._error('Estimate gas laxity ' + (gasLimit - result.receipt.gasUsed), func, args, value, gasLimit))
        }

        /** @namespace result.receipt */
        if (result.receipt.gasUsed >= gasLimit) {
          throw new TxError('Unknown out of gas error', TX_FRONTEND_ERROR_CODES.FRONTEND_OUT_OF_GAS)
        }
      }

      /** EVENT ERROR HANDLING */
      for (const log of result.logs) {
        if (log.event.toLowerCase() === 'error') {
          let errorCode
          try {
            errorCode = log.args.errorCode.toNumber()
          } catch (e) {
            errorCode = TX_FRONTEND_ERROR_CODES.FRONTEND_UNKNOWN
          }
          if (!this._okCodes.includes(errorCode)) {
            // eslint-disable-next-line
            console.warn(
              this._error(
                'Tx Error', func, args, value, gasLimit,
                this._txErrorDefiner(new TxError('Error event was emitted for OK code', errorCode)),
              ))
            throw new TxError('Error event was emitted', errorCode)
          }
        }
      }

      /** SUCCESS */
      AbstractContractDAO.txEnd(tx)

      return result
    } catch (e) {
      /** FAIL */
      const code = e.code
      const userError = this._txErrorDefiner(e)
      const isFrontendCancelled = code === TX_FRONTEND_ERROR_CODES.FRONTEND_CANCELLED
      AbstractContractDAO.txEnd(tx, !isFrontendCancelled ? userError : null)
      const devError = this._error('tx', func, args, value, gasLimit, userError)
      devError.stack = e.stack

      if (!isFrontendCancelled) {
        // eslint-disable-next-line
        console.warn(devError)
        // eslint-disable-next-line
        console.warn(e)
      }

      throw userError
    }
  }

  estimateGas = async (func: string, args = [], value = null, account): number | Object => {
    const deployed = await this.contract
    if (!deployed.hasOwnProperty(func)) {
      throw this._error('estimateGas func not found', func)
    }

    const [gasPrice, estimatedGas] = await Promise.all([
      this._web3Provider.getGasPrice(),
      deployed[func].estimateGas(...args, {
        from: account || this.getAccount(),
        value,
        gas: DEFAULT_GAS,
      }),
    ])

    const gasPriceBN = new BigNumber(gasPrice)
    const gasLimit = process.env.NODE_ENV === 'development' ? DEFAULT_GAS : estimatedGas + 1
    const gasFee = gasPriceBN.mul(gasLimit)

    return { gasLimit, gasFee, gasPrice: gasPriceBN }
  }

  /**
   * Fires callback on every event emit till you will call...
   * @see AbstractContractDAO.stopWholeWatching
   * @param event name
   * @param callback in the absence of error will receive event result object, block number and timestamp in milliseconds
   * @param filters
   * @protected
   */
  async _watch (event, callback, filters = {}) {
    await this.contract
    const deployed = await this._eventsContract
    if (!deployed.hasOwnProperty(event)) {
      throw this._error('_watch event not found', event, filters)
    }

    const startTime = AbstractContractDAO._eventsWatchStartTime
    const instance = deployed[event](filters, {
      fromBlock: 'latest',
      toBlock: 'latest',
    })
    this._addFilterEvent(instance)
    return instance.watch(async (e, result) => {
      if (e) {
        // eslint-disable-next-line
        console.error('_watch error:', e)
        return
      }
      const block = await this._web3Provider.getBlock(result.blockNumber, true)
      const timestamp = block.timestamp * 1000
      if (timestamp < startTime) {
        return
      }
      if (process.env.NODE_ENV === 'development') {
        // for debug
        // eslint-disable-next-line
        console.log(`%c <-- ${this.getContractName()}.${event}`, 'color: #fff; background: #00a', result.args)
      }
      callback(
        result,
        result.blockNumber,
        timestamp,
      )
    })
  }

  /**
   * Get pack of events.
   * @param event
   * @param fromBlock
   * @param toBlock
   * @param filters
   * @param total If 'total' > 0, then function will return maximum 'total' entries per one call of function. Call this
   * function again with the same params to get next 'total' entries. Function will filter blocks step-by-step (cache
   * results if necessary) till block = max('fromBlock', contract origin block), so feel free to specify 'fromBlock' = 0
   * @param id You can also specify unique id param to associate it with request cache and then remove this cache by id
   * @see AbstractContractDAO.resetFilterCache. This is necessary when you want to use same DAO to create different similar filters
   * @returns {Promise<Array>} If resulting array is empty, then there is no more suitable events for your request.
   * @see PendingManagerDAO.getCompletedList
   * @protected
   */
  async _get (event: string, fromBlock = 0, toBlock = 'latest', filters = {}, total: number = 0, id = ''): Array {
    await this.contract
    const deployed = await this._eventsContract
    if (!deployed.hasOwnProperty(event)) {
      throw this._error('_get event not found', event, filters)
    }

    total = parseInt(total, 10)
    if (total < 0) {
      throw new Error('total should be positive integer or zero')
    }

    const step = total > 0 ? FILTER_BLOCK_STEP : (toBlock - fromBlock)
    const requestId = id || (event + fromBlock + toBlock + JSON.stringify(filters) + total)
    const cache = this._getFilterCache(requestId) || {}
    let logs = cache.logs || []
    fromBlock = Math.max(fromBlock, 0)
    toBlock = cache.toBlock || (toBlock === 'latest' ? await this._web3Provider.getBlockNumber() : toBlock)

    for (let i = toBlock; i >= fromBlock && (logs.length < total || total === 0); i -= step + 1) {
      toBlock = Math.max(i, 0)
      const iFromBlock = Math.max(i - step, 0)
      const result = await new Promise((resolve) => {
        const filter = deployed[event](filters, { fromBlock: iFromBlock, toBlock })
        filter.get((e, r) => {
          filter.stopWatching(() => {
          })
          if (e) {
            // eslint-disable-next-line
            console.error('_get error:', e)
            r = []
          }
          resolve(r)
        })
      })
      logs = [...logs, ...result.reverse()]
      toBlock = iFromBlock - 1
      const code = iFromBlock > 0 ? await this.getCode(deployed.address, toBlock) : null
      if (!code) {
        toBlock = -1
        break
      }
    }

    if (total > 0) {
      this._setFilterCache(requestId, { logs: logs.slice(total), toBlock })
      return logs.slice(0, total)
    }

    return logs
  }

  /** @protected */
  _setFilterCache (id, data) {
    AbstractContractDAO._filterCache[this._uniqId][id] = data
  }

  /** @protected */
  _getFilterCache (id) {
    return AbstractContractDAO._filterCache[this._uniqId][id]
  }

  resetFilterCache (id = null) {
    if (id) {
      AbstractContractDAO._filterCache[this._uniqId][id] = null
      return
    }
    AbstractContractDAO._filterCache[this._uniqId] = {}
  }

  static resetWholeFilterCache () {
    for (const k of Object.keys(AbstractContractDAO._filterCache)) {
      AbstractContractDAO._filterCache[k] = {}
    }
  }

  /** @protected */
  _addFilterEvent (event) {
    AbstractContractDAO._events[this._uniqId].push(event)
  }

  /** @private */
  static async _stopWatching (events) {
    return new Promise((resolve) => {
      if (!events.length) {
        return resolve()
      }
      let i = 0
      events.forEach((event) => {
        event.stopWatching(() => {
          i++
          if (i === events.length) {
            AbstractContractDAO._eventsWatchStartTime = Date.now()
            resolve()
          }
        })
      })
    })
  }

  async stopWatching () {
    await AbstractContractDAO._stopWatching(this.getWatchedEvents())
    AbstractContractDAO._events[this._uniqId] = []
  }

  static async stopWholeWatching () {
    await AbstractContractDAO._stopWatching(AbstractContractDAO.getWholeWatchedEvents())
    for (const key of Object.keys(AbstractContractDAO._events)) {
      AbstractContractDAO._events[key] = []
    }
  }

  getWatchedEvents () {
    return AbstractContractDAO._events[this._uniqId]
  }

  static getWholeWatchedEvents () {
    let r = []
    for (const events of Object.values(AbstractContractDAO._events)) {
      r = [...r, ...events]
    }
    return r
  }
}
