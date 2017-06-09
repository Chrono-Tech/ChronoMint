// noinspection NpmUsedModulesInstalled
import truffleContract from 'truffle-contract'
import validator from '../components/forms/validator'
import web3Provider from '../network/Web3Provider'
import LS from '../utils/LocalStorage'
import IPFS from '../utils/IPFS'
import AbstractModel from '../models/AbstractModel'
import TransactionExecModel from '../models/TransactionExecModel'
import Web3Converter from '../utils/Web3Converter'

const eventsContracts = []

/**
 * @type {number} to distinguish old and new blockchain events
 * @see AbstractContractDAO._watch
 */
const timestampStart = Date.now()

const MAX_ATTEMPTS_TO_RISE_GAS = 3
const DEFAULT_GAS = 200000

/**
 * Collection of all blockchain events to stop watching all of them via only one call of...
 * @see AbstractContractDAO.stopWatching
 * @type {Array}
 */
let events = []

export default class AbstractContractDAO {
  /**
   * @type {Web3Converter}
   * @protected
   */
  _c = Web3Converter

  constructor (json, at = null, eventsJSON = null) {
    if (new.target === AbstractContractDAO) {
      throw new TypeError('Cannot construct AbstractContractDAO instance directly')
    }
    this._json = json
    this._at = at
    this._eventsJSON = eventsJSON
    this._eventsContract = null
    this._defaultBlock = 'latest'

    this._initWeb3()
    this.contract = this._initContract()
    this.contract.catch(() => false)
  }

  /**
   * @returns {boolean|Promise}
   * @private
   */
  async _initWeb3 () {
    web3Provider.onReset(() => {
      this.contract = this._initContract()
    })
    this.web3 = await web3Provider.getWeb3()
    return this.web3
  }

  /** @private */
  async _initContract (web3 = null) {
    if (this._at !== null && validator.address(this._at) !== null) {
      throw new Error('invalid address passed')
    }
    try {
      web3 = web3 || await web3Provider.getWeb3()

      const contract = truffleContract(this._json)
      contract.setProvider(web3.currentProvider)
      await contract.detectNetwork()
      contract.address = this._at || contract.address
      const deployed = await contract.deployed()

      this._at = deployed.address
      if (this._eventsJSON && !this._eventsContract) {
        let eventsAddress
        const key = web3.sha3(this._eventsJSON)
        if (eventsContracts.hasOwnProperty(key)) {
          eventsAddress = eventsContracts[key]
        } else {
          const events = truffleContract(this._eventsJSON)
          events.setProvider(web3.currentProvider)
          const deployedEvents = await events.deployed()
          eventsAddress = deployedEvents.address
          eventsContracts[key] = eventsAddress
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

  // TODO isDeployed (checkCodeConsistency = true): Promise<bool> {
  isDeployed (): Promise<bool> {
    return new Promise(async (resolve) => {
      const web3 = web3Provider.getWeb3instance()
      try {
        await this._initContract(web3, true)
      } catch (e) {
        resolve(new Error('isDeployed: ' + e.message))
      }
      web3.eth.getCode(this.getInitAddress(), (e, resolvedCode) => {
        if (e) {
          resolve(new Error('isDeployed getCode failed: ' + e.message))
        }
        if (!resolvedCode || /^0x[0]?$/.test(resolvedCode)) {
          resolve(new Error('isDeployed resolved code is empty'))
        }
        // TODO resolvedCode is different from json.unlinked_binary. Why?
        // if (checkCodeConsistency && resolvedCode !== this._json.unlinked_binary) {
        //   resolve(new Error('isDeployed check code consistency failed'))
        // }
        resolve(true)
      })
    })
  }

  // async isDeployed (): Promise<bool> {
  //   return new Promise(async (resolve) => {
  //     const web3 = web3Provider.getWeb3instance()
  //     await this._initContract(web3, true)
  //     web3.eth.getCode(this.getInitAddress(), function (e, code) {
  //       resolve(!(e || !code || code === '0x0'))
  //     })
  //   })
  // }

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
    return IPFS.get(this._c.bytes32ToIPFSHash(bytes))
  }

  /** @protected */
  async _ipfsPut (data): Promise<string> {
    return this._c.ipfsHashToBytes32(await IPFS.put(data))
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
   * @param tx
   */
  static txStart = (tx: TransactionExecModel) => {}

  /**
   * Optionally call this function after receiving of transaction estimated gas
   * @param tx
   */
  static txGas = (tx: TransactionExecModel) => {}

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
  _error (msg, func, args, value, gas, e: Error): Error {
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
      value + ' [' + gas + '] ' + (e ? e.message : ''))
  }

  /**
   * @param func
   * @param args
   * @param infoArgs key-value pairs to display in pending transactions list. If this param is empty, then it will be
   * filled with arguments names from contract ABI as a keys, args values as a values.
   * You can also pass here model, then this param will be filled with result of...
   * @param dryCallback use this param to extend your dry run behaviour. The transaction will only be executed if this
   * function (received the result of the dry run) returns true
   * @see AbstractModel.summary
   * Keys is using for I18N, for details see...
   * @see TransactionExecModel.description
   * @param value wei
   * @returns {Promise.<any>}
   * @protected
   */
  async _tx (func: string, args: Array = [], infoArgs: Object | AbstractModel = null,
             dryCallback = (r) => true, value: number = null): Promise<any> {
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
    AbstractContractDAO.txStart(tx)
    const params = [...args, {from: LS.getAccount(), value}]
    const exec = async (gas) => {
      tx = tx.set('gas', gas)
      AbstractContractDAO.txGas(tx)

      gas++ // if tx will spend this incremented value, then estimated gas is wrong and most likely we got out of gas
      params[params.length - 1].gas = gas // set gas to params

      try {
        // dry run
        const dryResult = await deployed[func].call.apply(null, params)
        if (dryCallback(dryResult) !== true) {
          // noinspection ExceptionCaughtLocallyJS
          throw new Error('Dry run validation failed')
        }

        // transaction
        const result = await deployed[func].apply(null, params)

        for (let log of result.logs) {
          if (log.event.toLowerCase() === 'error') {
            let eventArgs = ''
            for (let i in log.event.args) {
              if (log.event.args.hasOwnProperty(i)) {
                if (eventArgs !== '') {
                  eventArgs += ', '
                }
                eventArgs += i + ' = ' + log.event.args[i]
              }
            }
            // noinspection ExceptionCaughtLocallyJS
            throw new Error('Error event was emitted, args: ', + eventArgs)
          }
        }

        if (typeof result === 'object' && result.hasOwnProperty('receipt')) {
          tx = tx.set('gasUsed', result.receipt.gasUsed)
          if (result.receipt.gasUsed === gas) {
            attemptsToRiseGas = 0
            // noinspection ExceptionCaughtLocallyJS
            throw new Error('Unknown out of gas error :( Please contact the administrators!')
          }
        }
        AbstractContractDAO.txEnd(tx)
        return result
      } catch (e) {
        if (e.message.includes('out of gas') && attemptsToRiseGas > 0) {
          --attemptsToRiseGas
          const newGas = Math.ceil(gas * 1.5)
          console.warn(this._error(`out of gas, raised to: ${newGas}, attempts left: ${attemptsToRiseGas}`,
            func, args, value, gas, e))
          return exec(newGas)
        }
        AbstractContractDAO.txEnd(tx, e)

        const error = this._error('tx', func, args, value, gas, e)
        console.warn(error)
        throw error
      }
    }
    let gas = DEFAULT_GAS
    try {
      gas = await deployed[func].estimateGas.apply(null, params)
    } catch (e) {
      console.error(this._error('Estimate gas failed, fallback to default gas', func, args, value, undefined, e))
    }
    return exec(gas)
  }

  /**
   * This function will read events from the last block saved in window.localStorage or from the latest network block
   * if localStorage for provided event is empty.
   * @param event
   * @param callback in the absence of error will receive event result object, block number, timestamp of event
   * in milliseconds and special isOld flag, which will be true if received event is older than timestampStart
   * @see timestampStart
   * @param id To able to save last read block, pass unique constant id to this param and don't change it if you
   * want to keep receiving of saved block number from user localStorage. This id will be concatenated with event name.
   * Pass here "false" if you want to prevent such behaviour.
   * @param filters
   * @protected
   */
  async _watch (event: string, callback, id = this.getContractName(), filters = {}) {
    id = event + (id ? ('-' + id) : '')
    let fromBlock = id === false ? 'latest' : LS.getWatchFromBlock(id)

    await this.contract
    const deployed = await this._eventsContract
    if (!deployed.hasOwnProperty(event)) {
      throw this._error('_watch event not found', event, filters)
    }

    const instance = deployed[event](filters, {fromBlock, toBlock: 'latest'})
    events.push(instance)
    return instance.watch(async (e, result) => {
      if (process.env.NODE_ENV !== 'production') {
        // for debug
        console.info(`%c##${this.getContractName()}.${event}`, 'color: #fff; background: #00a', result.args)
      }
      if (e) {
        console.error('_watch error:', e)
        return
      }
      const block = await web3Provider.getBlock(result.blockNumber, true)
      if (id !== false) {
        LS.setWatchFromBlock(id, result.blockNumber)
      }
      callback(
        result,
        result.blockNumber,
        block.timestamp * 1000,
        Math.floor(timestampStart / 1000) > block.timestamp
      )
    })
  }

  /** @protected */
  async _get (event: string, fromBlock, toBlock, filters = {}): Promise<Array> {
    await this.contract
    const deployed = await this._eventsContract
    if (!deployed.hasOwnProperty(event)) {
      throw this._error('_watch event not found', event, filters)
    }
    return new Promise(resolve => {
      deployed[event](filters, {fromBlock, toBlock}).get((e, r) => {
        if (e) {
          console.error('_get error:', e)
          return resolve([])
        }
        resolve(r)
      })
    })

  }

  static stopWatching () {
    events.forEach(item => item.stopWatching(() => {}))
    events = []
  }

  static getWatchedEvents () {
    return events
  }
}
