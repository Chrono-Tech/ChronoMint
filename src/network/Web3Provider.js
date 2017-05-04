import promisify from 'promisify-node-callback'

const ERROR_WEB3_UNDEFINED = 'Web3 is undefined. Please use setWeb3() first.'
// will be injected to class after resolve()
const promisifyFunctions = [
  'getBlock',
  'getBlockNumber',
  'getAccounts',
  'getBalance',
  'sendTransaction',
  'getTransaction'
]

class Web3Provider {
  _web3Promise = null
  _web3instance = null
  _resolveCallback = null
  _resetCallbacks = []

  constructor () {
    this._web3Promise = this._getWeb3Promise()
  }

  resolve () {
    const web3 = this._web3instance
    if (!web3) {
      throw new Error(ERROR_WEB3_UNDEFINED)
    }
    promisifyFunctions.forEach(func => {
      this[func] = promisify(web3.eth[func])
    })
    this._resolveCallback()
  }

  getWeb3 () {
    return this._web3Promise
  }

  getWeb3instance () {
    if (!this._web3instance) {
      throw new Error(ERROR_WEB3_UNDEFINED)
    }
    return this._web3instance
  }

  setWeb3 (Web3ClassOrInstance) {
    typeof Web3ClassOrInstance === 'function'
      ? this._web3instance = new Web3ClassOrInstance()
      : this._web3instance = Web3ClassOrInstance
  }

  _getWeb3Promise () {
    return new Promise(resolve => {
      this._resolveCallback = () => {
        // for debug
        window.web3instance = this._web3instance
        resolve(this._web3instance)
      }
    })
  }

  setProvider (provider) {
    const web3 = this._web3instance
    if (!web3) {
      throw new Error(ERROR_WEB3_UNDEFINED)
    }
    web3.setProvider(provider)
  }

  onReset (callback) {
    this._resetCallbacks.push(callback)
  }

  reset () {
    // stop watchers
    const resetCallbacks = this._resetCallbacks
    this._resetCallbacks = []
    resetCallbacks.forEach((callback) => callback())
    // reset filters
    if (this._web3instance) {
      this._web3instance.reset(false)
    }
    // create new instance
    this._web3instance = null
    this._web3Promise = this._getWeb3Promise()
  }
}

export default new Web3Provider()
