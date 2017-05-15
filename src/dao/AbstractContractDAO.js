import bs58 from 'bs58'
// noinspection NpmUsedModulesInstalled
import truffleContract from 'truffle-contract'
import { address as validateAddress } from '../components/forms/validate'
import web3Provider from '../network/Web3Provider'
import LS from '../dao/LocalStorageDAO'
import IPFSDAO from '../dao/IPFSDAO'
import AbstractModel from '../models/AbstractModel'
import TransactionExecModel from '../models/TransactionExecModel'

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
   * @returns {boolean|Promise}
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

  getContractName () {
    return this._json.contract_name
  }

  getData (func: string, args: Array = []) {
    return this.contract.then(deployed => {
      if (!deployed.contract.hasOwnProperty(func)) {
        throw new Error('unknown function ' + func + ' in contract ' + this.getContractName())
      }
      return deployed.contract[func].getData.apply(null, args)
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
   * @param bytes
   * @returns {string}
   * @protected
   */
  _bytesToString (bytes) {
    return this.web3.toUtf8(bytes)
  }

  /**
   * @param bytes
   * @returns {string}
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
   * Get object from IPFS with bytes32 hash.
   * @param bytes
   * @returns {Promise.<any|null>}
   * @protected
   */
  _ipfs (bytes) {
    return IPFSDAO.get(this._bytes32ToIPFSHash(bytes))
  }

  /**
   * @param value
   * @returns {string}
   * @protected
   */
  _IPFSHashToBytes32 (value) {
    return `0x${Buffer.from(bs58.decode(value)).toString('hex').substr(4)}`
  }

  /**
   * @param value
   * @returns {string}
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
   * @returns {boolean}
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
   * @returns {Promise}
   */
  _call (func, args: Array = [], block) {
    return new Promise((resolve, reject) => {
      web3Provider.getWeb3().then(web3 => {
        if (!block) {
          block = web3.eth.defaultBlock
        }
        this.contract.then(deployed => {
          if (!deployed.hasOwnProperty(func)) {
            throw new Error('unknown function ' + func + ' in contract ' + this.getContractName())
          }
          deployed[func].call.apply(null, [...args, {}, block]).then(result => {
            resolve(result)
          }).catch(e => {
            console.error('_call', func, args, block, e)
            reject(e)
          })
        })
      })
    })
  }

  _callNum (func, args: Array = [], block) {
    return this._call(func, args, block).then(r => r.toNumber())
  }

  /**
   * Call this function before transaction
   * @see _tx
   * @see ChronoMintDAO.sendETH
   * @param tx
   */
  static txStart = (tx: TransactionExecModel) => {}

  /**
   * Optionally call this function after receiving of transaction estimated gas
   * @param id
   * @param gas
   */
  static txGas = (id, gas: number) => {}

  /**
   * Call this function after transaction
   * @param id
   * @param e
   */
  static txEnd = (id, e: Error = null) => {}

  /**
   * Returns function exec args associated with names from contract ABI
   * @param func
   * @param args
   * @private
   */
  _argsWithNames (func: string, args: Array = []) {
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

  /**
   * @param func
   * @param args
   * @param infoArgs key-value pairs to display in pending transactions list. If this param is empty, then it will be
   * filled with arguments names from contract ABI as a keys, args values as a values.
   * You can also pass here model, then this param will be filled with result of...
   * @see AbstractModel.summary
   * Keys is using for I18N, for details see...
   * @see TransactionExecModel.description
   * @param value wei
   * @returns {Promise}
   * @protected
   */
  _tx (func: string, args: Array = [], infoArgs: Object | AbstractModel = null, value: number = null) {
    return new Promise((resolve, reject) => {
      infoArgs = infoArgs
        ? (typeof infoArgs['summary'] === 'function' ? infoArgs.summary() : infoArgs)
        : this._argsWithNames(func, args)

      const tx = new TransactionExecModel({
        contract: this.getContractName(),
        func,
        args: infoArgs,
        value: this.fromWei(value)
      })
      AbstractContractDAO.txStart(tx)
      this.contract.then(deployed => {
        const params = [...args, {from: LS.getAccount(), value}]
        const callback = (gas) => {
          AbstractContractDAO.txGas(tx.id(), gas)
          gas++ // if tx will spend this incremented value, then estimated gas is wrong and most likely we got OOG
          params[params.length - 1].gas = gas // set gas to params
          deployed[func].call.apply(null, params).then(() => { // dry run
            deployed[func].apply(null, params).then(result => { // transaction
              let e = null
              if (typeof result === 'object' && result.hasOwnProperty('receipt') && result.receipt.gasUsed === gas) {
                result = null
                e = new Error('out of gas')
              }
              AbstractContractDAO.txEnd(tx.id(), e)
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
              return callback(newGas)
            }
            AbstractContractDAO.txEnd(tx.id(), e)
            console.error('tx call', e)
            reject(e)
          })
        }
        deployed[func].estimateGas.apply(null, params).then(gas => callback(gas))
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
  _watch (event: string, callback, id = this.getContractName()) {
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
