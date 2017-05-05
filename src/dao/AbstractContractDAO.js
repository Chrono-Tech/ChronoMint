// noinspection NpmUsedModulesInstalled
import truffleContract from 'truffle-contract'
import { address as validateAddress } from '../components/forms/validate'
import web3Provider from '../network/Web3Provider'
import LS from '../dao/LocalStorageDAO'
import AbstractModel from '../models/AbstractModel'
import PendingTransactionModel from '../models/PendingTransactionModel'
import converter from '../utils/converter'

/**
 * @type {number} to distinguish old and new blockchain events
 * @see AbstractContractDAO._watch
 */
const timestampStart = Date.now()

/**
 * Collection of all blockchain events to stop watching all of them via only one call of...
 * @see AbstractContractDAO.stopWatching
 * @type {Array}
 */
let events = []

class AbstractContractDAO {
  converter = converter

  constructor (json, at = null) {
    if (new.target === AbstractContractDAO) {
      throw new TypeError('Cannot construct AbstractContractDAO instance directly')
    }
    this._json = json
    this._at = at

    this._initWeb3()
    this.contract = this._initContract(json, at)
    this.contract.catch(e => {
      console.error(e)
      return false
    })
  }

  /**
   * @return {boolean|Promise}
   * @private
   */
  _initWeb3 () {
    web3Provider.onReset(() => {
      this._initWeb3()
      this.contract = this._initContract(this._json, this._at)
    })
    return web3Provider.getWeb3().then((web3) => {
      this.web3 = web3
      return web3
    })
  }

  /**
   * @param json
   * @param at
   * @private
   */
  _initContract (json, at) {
    return new Promise((resolve, reject) => {
      if (at !== null && validateAddress(at) !== null) {
        reject(new Error('invalid address passed'))
      }
      web3Provider.getWeb3()
        .then((web3) => {
          const contract = truffleContract(json)
          contract.setProvider(web3.currentProvider)
          return contract[at === null ? 'deployed' : 'at'](at)
        })
        .then(i => resolve(i))
        .catch(e => reject(e))
    })
  }

  /**
   * @param web3
   * @param account
   * @returns {Promise.<bool>}
   */
  isContractDeployed (web3, account) {
    return new Promise((resolve) => {
      const contract = truffleContract(this._json) // TODO get rid of this duplicated (_initContract) contract init
      contract.setProvider(web3.currentProvider)
      const deployedContract = contract[this._at === null ? 'deployed' : 'at'](account)
      deployedContract
        .then(() => resolve(true))
        .catch((e) => {
          console.log(e)
          return resolve(false)
        })
    })
  }

  getAddress () {
    return this.contract.then(deployed => deployed.address)
  }

  /**
   * @param func
   * @param args
   * @param block
   * @protected
   * @return {Promise}
   */
  _call (func, args: Array = [], block) {
    return new Promise((resolve, reject) => {
      web3Provider.getWeb3().then(web3 => {
        if (!block) {
          block = web3.eth.defaultBlock
        }
        this.contract.then(deployed => {
          deployed[func].call.apply(null, [...args, {}, block]).then(result => {
            resolve(result)
          }).catch(e => {
            console.error('call', e)
            reject(e)
          })
        })
      })
    })
  }

  /**
   * Call this function before transaction
   * @see _tx
   * @see ChronoMintDAO.sendETH
   * @param tx
   */
  static txStart = (tx: PendingTransactionModel) => {}

  /**
   * Optionally call this function after receiving of transaction estimated gas
   * @param gas
   */
  static txGas = (gas: number) => {}

  /**
   * Call this function after transaction
   * @param id
   * @param e
   */
  static txEnd = (id, e: Error = null) => {}

  /**
   * @param func
   * @param args
   * @param infoArgs key-value pairs to display in pending transactions list, if this param is empty, then it will be
   * filled with arguments names from contract ABI as a keys and args values as a values. You can also pass model,
   * then param will be filled with result of...
   * @see AbstractModel.summary
   * Keys is using for I18N, for details see...
   * @see PendingTransactionModel.args
   * @param value wei
   * @param gas
   * @returns {Promise}
   * @protected
   */
  _tx (func: string, args: Array = [], infoArgs: Object|AbstractModel = null,
       value: number = null, gas: number = null) {
    let argsWithNames = null
    if (infoArgs) {
      argsWithNames = typeof infoArgs['summary'] === 'function' ? infoArgs.summary() : infoArgs
    } else {
      for (let i in this._json.abi) {
        if (this._json.abi.hasOwnProperty(i) && this._json.abi[i].name === func) {
          const inputs = this._json.abi[i].inputs
          if (!argsWithNames) {
            argsWithNames = {}
          }
          for (let j in inputs) { // noinspection JSUnfilteredForInLoop
            if (!args.hasOwnProperty(j)) {
              throw new Error('invalid argument ' + j)
            } // noinspection JSUnfilteredForInLoop
            argsWithNames[inputs[j].name] = args[j]
          }
          break
        }
      }
    }
    if (argsWithNames === null) {
      throw new Error('argsWithNames should not be null')
    }
    const tx = new PendingTransactionModel({
      contract: this._json.contract_name,
      func,
      args: argsWithNames,
      value: this.converter.fromWei(value)
    })
    AbstractContractDAO.txStart(tx)
    return new Promise((resolve, reject) => {
      this.contract.then(deployed => {
        const callback = (gas) => {
          AbstractContractDAO.txGas(gas)
          const params = [...args, {from: LS.getAccount(), gas, value}]
          deployed[func].call.apply(null, params).then(() => {
            deployed[func].apply(null, params).then(result => {
              AbstractContractDAO.txEnd(tx.id())
              resolve(result)
            }).catch(e => {
              AbstractContractDAO.txEnd(tx.id(), e)
              console.error('tx', e)
              reject(e)
            })
          }).catch(e => {
            if (e.message.includes('out of gas')) {
              const newGas = Math.ceil(gas * 1.5)
              console.log('failed gas', gas, '> new gas', newGas)
              return resolve(this._tx(func, args, infoArgs, value, newGas))
            }
            AbstractContractDAO.txEnd(tx.id(), e)
            console.error('tx call', e)
            reject(e)
          })
        }
        if (gas) {
          callback(gas)
        } else {
          deployed[func].estimateGas.apply(null, [...args, {value}]).then(gas => callback(gas))
        }
      })
    })
  }

  /**
   * This function will read events from the last block saved in window.localStorage or from the latest network block
   * if localStorage for provided event is empty.
   * @param event
   * @param callback in the absence of error will receive event result object, block number, timestamp of event
   * in milliseconds and special isOld flag, which will be true if received event is older than timestampStart
   * @see timestampStart
   * @param id To able to save last read block, pass unique constant id to this param and don't change it if you
   * want to keep receiving of saved block number from user localStorage. This id will be concatenated with event name,
   * so if your event name is quite unique you can leave this param empty.
   * @protected
   */
  _watch (event: string, callback, id = null) {
    id = event + id
    let fromBlock = LS.getWatchFromBlock(id)
    fromBlock = fromBlock ? parseInt(fromBlock, 10) : 'latest'

    return this.contract.then(deployed => {
      const instance = deployed[event]({}, {fromBlock, toBlock: 'latest'})
      events.push(instance)
      return instance.watch((error, result) => {
        if (error) {
          console.error('_watch error:', error)
          return
        }
        web3Provider.getWeb3().then(web3 => {
          web3.eth.getBlock(result.blockNumber, (e, block) => {
            if (e) {
              console.error('_watch getBlock', e)
              return
            }
            const ts = block.timestamp
            LS.setWatchFromBlock(id, result.blockNumber)
            callback(
              result,
              result.blockNumber,
              ts * 1000,
              Math.floor(timestampStart / 1000) > ts
            )
          })
        })
      })
    })
  }

  static stopWatching () {
    return new Promise((resolve, reject) => {
      const oldEvents = events
      events = []
      oldEvents.forEach(event => {
        event.stopWatching((error) => {
          if (error) {
            reject(error)
          }
        })
      })
      resolve()
    }).catch(e => console.error('Stop watching', e))
  }

  static getWatchedEvents () {
    return events
  }
}

export default AbstractContractDAO
