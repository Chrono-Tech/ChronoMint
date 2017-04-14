import Web3 from 'web3'
import bs58 from 'bs58'
import truffleContract from 'truffle-contract'
import isEthAddress from '../utils/isEthAddress'

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
const events = []

class AbstractContractDAO {
  static _web3 = null

  constructor (json, at = null, optimized = true) {
    if (new.target === AbstractContractDAO) {
      throw new TypeError('Cannot construct AbstractContractDAO instance directly')
    }
    const initWeb3 = this._initWeb3()
    if (initWeb3 === true && !optimized) {
      this.contract = this._initContract(json, at)
      return
    }
    this.contract = new Promise((resolve, reject) => {
      if (at !== null && !isEthAddress(at)) {
        reject(new Error('invalid address passed'))
      }
      const callback = () => {
        this._initContract(json, at)
          .then(i => resolve(i))
          .catch(e => reject(e))
      }
      if (initWeb3 === true) {
        return callback()
      }
      initWeb3.then(callback)
    })
  }

  /**
   * @return {boolean|Promise}
   * @private
   */
  _initWeb3 () {
    if (AbstractContractDAO._web3) {
      // we need separate web3 instance for each DAO, for instance to separately change eth.defaultBlock
      this.web3 = new Web3(AbstractContractDAO._web3.currentProvider)
      return true
    }
    return new Promise(resolve => {
      window.resolveWeb3.then(web3 => {
        this.web3 = web3
          ? new Web3(web3.currentProvider)
          : new Web3(new Web3.providers.HttpProvider('http://localhost:8545'))

        if (!AbstractContractDAO._web3) {
          AbstractContractDAO._web3 = this.web3
        }
        resolve()
      })
    })
  }

  /**
   * @param json
   * @param at
   * @private
   */
  _initContract (json, at) {
    const contract = truffleContract(json)
    contract.setProvider(this.web3.currentProvider)
    return contract[at === null ? 'deployed' : 'at'](at)
  }

  getAccounts () {
    return this.web3.eth.accounts
  }

  getAddress () {
    return this.contract.then(deployed => deployed.address)
  };

  /**
   * @param bytes
   * @return {string}
   * @protected
   */
  _bytesToString (bytes) {
    return this.web3.toAscii(bytes).replace(/\u0000/g, '')
  };

  /**
   * @param bytes
   * @return {string}
   * @protected
   */
  _bytes32ToIPFSHash (bytes) {
    // if (/^0x0{63}[0,1]$/.test(bytes)) return ''

    const string = Buffer.from(bytes.replace(/^0x/, '1220'), 'hex')
    return bs58.encode(string)
  };

  /**
   * @param value
   * @return {string}
   * @protected
   */
  _IPFSHashToBytes32 (value) {
    return `0x${Buffer.from(bs58.decode(value)).toString('hex').substr(4)}`
  };

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
  };

  /**
   * This function will read events from the last block saved in window.localStorage or from the latest block in network
   * if localStorage for provided event is empty.
   * @param event
   * @param callback in the absence of error will receive event result object, block number, timestamp of event
   * in milliseconds and special isOld flag, which will be true if received event is older than timestampStart
   * @see timestampStart
   * @param id To able to save last read block, pass unique constant id to this param and don't change it if you
   * want to keep receiving of saved block number from user localStorage.
   * @protected
   */
  _watch (event, callback, id = Math.random()) {
    const key = 'fromBlock-' + id
    let fromBlock = window.localStorage.getItem(key)
    fromBlock = fromBlock ? parseInt(fromBlock, 10) : 'latest'
    const instance = event({}, {fromBlock, toBlock: 'latest'})
    instance.watch((error, result) => {
      if (!error) {
        this.web3.eth.getBlock(result.blockNumber, (e, block) => {
          const ts = block.timestamp
          window.localStorage.setItem(key, result.blockNumber + 1)
          callback(
            result,
            result.blockNumber,
            ts * 1000,
            Math.floor(timestampStart / 1000) > ts
          )
        })
      }
    })
    events.push(instance)
  };

  static stopWatching () {
    for (let key in events) {
      if (events.hasOwnProperty(key)) {
        events[key].stopWatching()
      }
    }
    events.splice(0, events.length)
  }

  static getWatchedEvents () {
    return events
  }
}

export default AbstractContractDAO
