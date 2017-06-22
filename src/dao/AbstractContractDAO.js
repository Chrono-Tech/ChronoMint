// noinspection NpmUsedModulesInstalled
import truffleContract from 'truffle-contract'

import AbstractModel from '../models/AbstractModel'
import TransactionExecModel from '../models/TransactionExecModel'

import ls from '../utils/LocalStorage'
import ipfs from '../utils/IPFS'
import web3Provider from '../network/Web3Provider'
import web3Converter from '../utils/Web3Converter'

import validator from '../components/forms/validator'
import errorCodes from './errorCodes'


const MAX_ATTEMPTS_TO_RISE_GAS = 3
const DEFAULT_GAS_LIMIT = 200000
const BLOCK_STEP = 60000

export class TxError extends Error {
  constructor (message, code) {
    super(message)
    this.code = code
  }
}


export default class AbstractContractDAO {
  /** @protected */
  _c = web3Converter

  /** @protected */
  _web3Provider = web3Provider

  /**
   * Collection of all blockchain events to stop watching all of them via only one call of...
   * @see AbstractContractDAO.stopWatching
   * @private
   */
  static _events = []
  
  /** @private */
  static _eventsContracts = []
  
  /** @private */
  static _filterCache = {}

  /**
   * @type {number} to distinguish old and new blockchain events
   * @see AbstractContractDAO._watch
   * @private
   */
  static _timestampStart = Date.now()

  constructor (json = null, at = null, eventsJSON = null) {
    if (new.target === AbstractContractDAO) {
      throw new TypeError('Cannot construct AbstractContractDAO instance directly')
    }
    this._json = json
    this._at = at
    this._eventsJSON = eventsJSON || json
    this._eventsContract = null
    this._defaultBlock = 'latest'

    if (json) {
      this.contract = this._initContract()
      this.contract.catch(() => false)
    }

    this._web3Provider.onReset(() => this.handleWeb3Reset())

    this._uniqId = this.constructor.name + '-' + Math.random()
    AbstractContractDAO._filterCache[this._uniqId] = {}
  }

  handleWeb3Reset () {
    if (this.contract) {
      this.contract = this._initContract()
    }
  }

  /** @private */
  async _initContract (web3 = null) {
    if (this._at !== null && validator.address(this._at) !== null) {
      throw new Error('invalid address passed')
    }
    try {
      web3 = web3 || await this._web3Provider.getWeb3()

      const contract = truffleContract(this._json)
      contract.setProvider(web3.currentProvider)
      await contract.detectNetwork()
      contract.address = this._at || contract.address
      const deployed = await contract.deployed()

      this._at = deployed.address
      if (this._eventsJSON && !this._eventsContract && this._eventsJSON !== this._json) {
        let eventsAddress
        const key = web3.sha3(this._eventsJSON)
        if (AbstractContractDAO._eventsContracts.hasOwnProperty(key)) {
          eventsAddress = AbstractContractDAO._eventsContracts[key]
        } else {
          const events = truffleContract(this._eventsJSON)
          events.setProvider(web3.currentProvider)
          const deployedEvents = await events.deployed()
          eventsAddress = deployedEvents.address
          AbstractContractDAO._eventsContracts[key] = eventsAddress
        }

        const eventsContract = truffleContract(this._json)
        eventsContract.setProvider(web3.currentProvider)
        await eventsContract.detectNetwork()
        eventsContract.address = eventsAddress

        this._eventsContract = eventsContract.deployed()
      }

      this._eventsContract = this._eventsContract || Promise.resolve(deployed)

      return deployed
    } catch (e) {
      throw new Error('_initContract error: ' + e.message)
    }
  }

  // TODO @bshevchenko: isDeployed (checkCodeConsistency = true): Promise<bool> {
  async isDeployed (): Promise<bool> {
    try {
      await this._initContract(this._web3Provider.getWeb3instance(), true)
      const code = await this._web3Provider.getCode(this.getInitAddress())
      if (!code || /^0x[0]?$/.test(code)) {
        throw new Error('isDeployed code is empty')
      }
      // TODO @bshevchenko: code is different from json.unlinked_binary when contract using libraries
      // if (checkCodeConsistency && code !== this._json.unlinked_binary) {
      //   resolve(new Error('isDeployed check code consistency failed'))
      // }
      return true
    } catch (e) {
      console.error('Deployed error', e)
      return false
    }
  }

  async getAddress () {
    return this._at || this.contract.then(i => i.address)
  }

  getInitAddress () {
    return this._at
  }

  getContractName () {
    return this._json.contract_name
  }

  setDefaultBlock (block) {
    this._defaultBlock = block
  }

  // noinspection JSUnusedGlobalSymbols
  async getData (func: string, args: Array = []): string {
    const deployed = await this.contract
    if (!deployed.contract.hasOwnProperty(func)) {
      throw new Error('unknown function ' + func + ' in contract ' + this.getContractName())
    }
    return deployed.contract[func].getData.apply(null, args)
  }

  /** @protected */
  _ipfs (bytes): Promise<any> {
    return ipfs.get(this._c.bytes32ToIPFSHash(bytes))
  }

  /** @protected */
  async _ipfsPut (data): Promise<string> {
    return this._c.ipfsHashToBytes32(await ipfs.put(data))
  }

  /** @protected */
  async _call (func, args: Array = [], block): Promise<any> {
    block = block || this._defaultBlock
    const deployed = await this.contract
    if (!deployed.hasOwnProperty(func)) {
      throw new Error('unknown function ' + func + ' in contract ' + this.getContractName())
    }
    try {
      return deployed[func].call.apply(null, [...args, {}, block])
    } catch (e) {
      throw this._error('_call error', func, args, null, null, e)
    }
  }

  async _callNum (func, args: Array = [], block): Promise<number> {
    const r = await this._call(func, args, block)
    return r.toNumber()
  }

  isEmptyAddress (address: string): boolean {
    return address === '0x0000000000000000000000000000000000000000'
  }

  /**
   * Call this function before transaction
   * @see _tx
   * @see EthereumDAO.transfer
   * @throws TxError
   * @param tx
   */
  static txStart = (tx: TransactionExecModel) => {}

  /**
   * Call this function after transaction
   * @param tx
   * @param e
   */
  static txEnd = (tx: TransactionExecModel, e: Error = null) => {}

  /**
   * Returns function exec args associated with names from contract ABI
   * @param func
   * @param args
   * @private
   */
  _argsWithNames (func: string, args: Array = []): Object {
    let r = null
    for (let i in this._json.abi) {
      if (this._json.abi.hasOwnProperty(i) && this._json.abi[i].name === func) {
        const inputs = this._json.abi[i].inputs
        if (!r) {
          r = {}
        }
        for (let j in inputs) {
          if (inputs.hasOwnProperty(j)) {
            if (!args.hasOwnProperty(j)) {
              throw new Error('invalid argument ' + j)
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
  _error (msg, func, args, value, gas, e: Error | TxError): Error {
    if (typeof args === 'object') {
      const newArgs = []
      for (let i in args) {
        if (args.hasOwnProperty(i)) {
          newArgs.push(i + '=' + args[i])
        }
      }
      args = newArgs
    }
    return new Error(msg + '; ' + this.getContractName() + '.' + func + '(' + args.toString() + '):' +
      value + ' [' + gas + '] ' + (e ? (e.message + ', code ' + e.code) : ''))
  }

  /**
   * @param func
   * @param args
   * @param infoArgs key-value pairs to display in pending transactions list. If this param is empty, then it will be
   * filled with arguments names from contract ABI as a keys, args values as a values.
   * You can also pass here model, then this param will be filled with result of...
   * @see AbstractModel.summary
   * Keys is using for I18N, for details see...
   * @see TransactionExecModel.description
   * @param value
   * @param multisig - multisig address
   * @returns {Promise<Object>} receipt
   * @protected
   */
  async _tx (func: string, args: Array = [], infoArgs: Object | AbstractModel = null, value = null, multisig = null): Promise<Object> {
    const deployed = await this.contract
    if (!deployed.hasOwnProperty(func)) {
      throw this._error('_tx func not found', func)
    }

    let attemptsToRiseGas = MAX_ATTEMPTS_TO_RISE_GAS
    infoArgs = infoArgs
      ? (typeof infoArgs['summary'] === 'function' ? infoArgs.summary() : infoArgs)
      : this._argsWithNames(func, args)

    let tx = new TransactionExecModel({
      contract: this.getContractName(),
      func,
      args: infoArgs,
      value: this._c.fromWei(value)
    })
    const params = [...args, {from: ls.getAccount(), value}]
    const exec = async (gasLimit) => {
      const gasPrice = await this._web3Provider.getGasPrice()
      tx = tx.set('gas', this._c.fromWei(gasLimit * gasPrice.toNumber()))

      gasLimit++ // if tx will spend this incremented value, then estimated gas is wrong and most likely we got out of gas
      params[params.length - 1].gas = gasLimit // set gas to params

      try {
        //multisig dry run
        if (multisig) {
          let multisigDryRunResult = await deployed[func].call.apply(null, [
            ...args, {
              from: multisig,
              value,
              gas: gasLimit
            }])
          multisigDryRunResult = multisigDryRunResult.toNumber()
          if (multisigDryRunResult !== errorCodes.OK && multisigDryRunResult !== errorCodes.MULTISIG_ADDED) {
            throw new TxError('Multisig Dry run failed', multisigDryRunResult)
          }
        }

        // dry run
        let dryResult = await deployed[func].call.apply(null, params)
        dryResult = dryResult.toNumber()
        if (dryResult !== errorCodes.OK && dryResult !== errorCodes.MULTISIG_ADDED) {
          throw new TxError('Dry run failed', dryResult)
        }

        await AbstractContractDAO.txStart(tx)

        // transaction
        const result = await deployed[func].apply(null, params)

        for (let log of result.logs) {
          if (log.event.toLowerCase() === 'error') {
            const errorCode = log.args.errorCode.toNumber() || errorCodes.UNDEFINED
            // TODO @bshevchenko: remove this if when MINT-258 will be done
            if (errorCode !== errorCodes.MULTISIG_ADDED) {
              throw new TxError('Error event was emitted', errorCode)
            }
          }
        }

        if (typeof result === 'object' && result.hasOwnProperty('receipt')) {
          tx = tx.set('gasUsed', result.receipt.gasUsed)
          if (result.receipt.gasUsed === gasLimit) {
            attemptsToRiseGas = 0 // unexpected behaviour, user should contact administrators
            throw new TxError('Unknown out of gas error', errorCodes.FRONTEND_OUT_OF_GAS)
          }
        }
        AbstractContractDAO.txEnd(tx)
        return result
      } catch (e) {
        // recursive gas limit multiplier for dry run when gas for some reason was estimated wrongly
        if (e.message.includes('out of gas') && attemptsToRiseGas > 0) {
          --attemptsToRiseGas
          const newGas = Math.ceil(gasLimit * 1.5)
          console.warn(this._error(`out of gas, raised to: ${newGas}, attempts left: ${attemptsToRiseGas}`,
            func, args, value, gasLimit, e))
          return exec(newGas)
        }

        if (!e.code) {
          // TODO @bshevchenko: handle Mist, Metamask, etc error of user tx cancellation and use FRONTEND_CANCELLED for it

          e = new TxError(e.message, errorCodes.FRONTEND_UNKNOWN)
        }

        AbstractContractDAO.txEnd(tx, e)

        const error = this._error('tx', func, args, value, gasLimit, e)
        console.warn(error)
        throw error
      }
    }
    let gasLimit = DEFAULT_GAS_LIMIT
    try {
      gasLimit = await deployed[func].estimateGas.apply(null, params)
    } catch (e) {
      console.error(this._error('Estimate gas failed, fallback to default gas limit', func, args, value, undefined, e))
    }
    return exec(gasLimit)
  }

  /**
   * This function will read events from the last block saved in window.localStorage or from the latest network block
   * if localStorage for provided event is empty.
   * @param event
   * @param callback in the absence of error will receive event result object, block number, timestamp of event
   * in milliseconds and special isOld flag, which will be true if received event is older than _timestampStart
   * @see AbstractContractDAO._timestampStart
   * @param id To able to save last read block, pass unique constant id to this param and don't change it if you
   * want to keep receiving of saved block number from user localStorage. This id will be concatenated with event name.
   * Pass here "false" if you want to prevent such behaviour.
   * @param filters
   * @protected
   */
  async _watch (event: string, callback, id = this.getContractName(), filters = {}) {
    id = event + (id ? ('-' + id) : '')
    let fromBlock = id === false ? 'latest' : ls.getWatchFromBlock(id)

    await this.contract
    const deployed = await this._eventsContract
    if (!deployed.hasOwnProperty(event)) {
      throw this._error('_watch event not found', event, filters)
    }

    const instance = deployed[event](filters, {fromBlock, toBlock: 'latest'})
    AbstractContractDAO.addFilterEvent(instance)
    return instance.watch(async (e, result) => {
      if (process.env.NODE_ENV !== 'production') {
        // for debug
        console.info(`%c##${this.getContractName()}.${event}`, 'color: #fff; background: #00a', result.args)
      }
      if (e) {
        console.error('_watch error:', e)
        return
      }
      const block = await this._web3Provider.getBlock(result.blockNumber, true)
      if (id !== false) {
        ls.setWatchFromBlock(id, result.blockNumber)
      }
      callback(
        result,
        result.blockNumber,
        block.timestamp * 1000,
        Math.floor(AbstractContractDAO._timestampStart / 1000) > block.timestamp
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
  async _get (event: string, fromBlock = 0, toBlock = 'latest', filters = {}, total: number = 0, id = ''): Promise<Array> {
    await this.contract
    const deployed = await this._eventsContract
    if (!deployed.hasOwnProperty(event)) {
      throw this._error('_get event not found', event, filters)
    }

    total = parseInt(total, 10)
    if (total < 0) {
      throw new Error('total should be positive integer or zero')
    }

    const step = total > 0 ? BLOCK_STEP : (toBlock - fromBlock)
    const requestId = id || (event + fromBlock + toBlock + JSON.stringify(filters) + total)
    const cache = this._getFilterCache(requestId) || {}
    let logs = cache['logs'] || []
    fromBlock = Math.max(fromBlock, 0)
    toBlock = cache['toBlock'] || (toBlock === 'latest' ? await this._web3Provider.getBlockNumber() : toBlock)

    for (let i = toBlock; i >= fromBlock && (logs.length < total || total === 0); i -= step + 1) {
      toBlock = Math.max(i, 0)
      const iFromBlock = Math.max(i - step, 0)
      const result = await new Promise(resolve => {
        const filter = deployed[event](filters, {fromBlock: iFromBlock, toBlock})
        filter.get((e, r) => {
          filter.stopWatching(() => {})
          if (e) {
            console.error('_get error:', e)
            r = []
          }
          resolve(r)
        })
      })
      logs = [...logs, ...result.reverse()]
      toBlock = iFromBlock - 1
      const code = iFromBlock > 0 ? await this._web3Provider.getCode(deployed.address, toBlock) : '0x0'
      if (code === '0x0') {
        toBlock = -1
        break
      }
    }

    if (total > 0) {
      this._setFilterCache(requestId, {logs: logs.slice(total), toBlock})
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
    for (let k of Object.keys(AbstractContractDAO._filterCache)) {
      AbstractContractDAO._filterCache[k] = {}
    }
  }

  static addFilterEvent (event) {
    AbstractContractDAO._events.push(event)
  }

  static stopWatching () {
    AbstractContractDAO._events.forEach(item => item.stopWatching(() => {}))
    AbstractContractDAO._events = []
  }

  static getWatchedEvents () {
    return AbstractContractDAO._events
  }
}
