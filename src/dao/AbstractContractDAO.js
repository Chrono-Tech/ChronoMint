import bs58 from 'bs58'
// noinspection NpmUsedModulesInstalled
import truffleContract from 'truffle-contract'
import { address as validateAddress } from '../components/forms/validate'
import web3Provider from '../network/Web3Provider'
import LS from '../dao/LocalStorageDAO'
import AbstractModel from '../models/AbstractModel'
import PendingTransactionModel from '../models/PendingTransactionModel'

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
   * From wei to ether.
   * web3.fromWei is not working properly in some browsers, so you should use this functions to convert your wei value.
   * @param n
   * @returns {number}
   */
  fromWei (n: number) {
    return n / 1000000000000000000
  }

  toWei (n: number) {
    return n * 1000000000000000000
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
   * @param bytes
   * @return {string}
   * @protected
   */
  _bytesToString (bytes) {
    return this.web3.toAscii(bytes).replace(/\u0000/g, '')
  }

  /**
   * @param bytes
   * @return {string}
   * @protected
   */
  _bytes32ToIPFSHash (bytes) {
    if (/^0x0{63}[01]$/.test(`${bytes}`)) {
      return ''
    }
    const string = Buffer.from(bytes.replace(/^0x/, '1220'), 'hex')
    return bs58.encode(string)
  }

  /**
   * @param value
   * @return {string}
   * @protected
   */
  _IPFSHashToBytes32 (value) {
    return `0x${Buffer.from(bs58.decode(value)).toString('hex').substr(4)}`
  }

  /**
   * @param value
   * @return {string}
   * @protected
   */
  _toBytes32 (value) {
    let zeros = '000000000000000000000000000000000000000000000000000000000000000'
    if (typeof value === 'string') {
      return ('0x' + [].reduce.call(value, (hex, c) => {
        return hex + c.charCodeAt(0).toString(16)
      }, '') + zeros).substr(0, 66)
    }
    let hexNumber = value.toString(16)
    return '0x' + (zeros + hexNumber).substring(hexNumber.length - 1)
  }

  /**
   * @param address
   * @return {boolean}
   * @protected
   */
  _isEmptyAddress (address: string) {
    return address === '0x0000000000000000000000000000000000000000'
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
            console.error(e)
            reject(e)
          })
        })
      })
    })
  }

  /**
   * @see AbstractContractDAO._tx will call this function before transaction
   * @param tx
   */
  static txStart = (tx: PendingTransactionModel) => {}

  /**
   * @see AbstractContractDAO._tx will call this function after transaction
   * @param id
   * @param fail
   */
  static txEnd = (id, fail: boolean = false) => {}

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
    return new Promise((resolve, reject) => {
      this.contract.then(deployed => {
        const callback = (gas) => {
          const tx = new PendingTransactionModel({
            contract: this._json.contract_name,
            func,
            args: argsWithNames,
            value,
            gas
          })
          const params = [...args, {from: LS.getAccount(), gas, value}]
          deployed[func].call.apply(null, params).then(() => {
            AbstractContractDAO.txStart(tx)
            deployed[func].apply(null, params).then(result => {
              AbstractContractDAO.txEnd(tx.id())
              resolve(result)
            }).catch(e => {
              AbstractContractDAO.txEnd(tx.id(), true)
              console.error('tx', e)
              reject(e)
            })
          }).catch(e => {
            if (e.message.includes('out of gas')) {
              const newGas = Math.ceil(gas * 1.5)
              console.log('failed gas', gas, '> new gas', newGas)
              return resolve(this._tx(func, args, infoArgs, value, newGas))
            }
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
