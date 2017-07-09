import promisify from 'promisify-node-callback'

const ERROR_WEB3_UNDEFINED = 'Web3 is undefined. Please use setWeb3() first.'

/**
 * will be injected to class on set web3
 * @see Web3Provider.setWeb3
 */
const promisifyFunctions = [ // TODO @bshevchenko: IDE can't resolve this functions, fix it
  'getBlock',
  'getBlockNumber',
  'getAccounts',
  'getBalance',
  'sendTransaction',
  'getTransaction',
  'getCode',
  'getGasPrice',
  'estimateGas'
]

export class Web3Provider {
  _web3Promise = null
  _web3instance = null
  _resolveCallback = null
  _resetCallbacks = []

  constructor (web3Instance = null) {
    if (web3Instance) {
      this.setWeb3((web3Instance))
    }
    this._web3Promise = this._getWeb3Promise()
  }

  resolve () {
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

    const web3 = this._web3instance
    promisifyFunctions.forEach(func => {
      this[func] = promisify(web3.eth[func])
    })
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
    // reset filters
    if (this._web3instance) {
      this._web3instance.reset(false)
    }

    // create new instance
    this._web3instance = null
    this._web3Promise = this._getWeb3Promise()
    this._resetCallbacks.forEach((callback) => callback())
  }
}

export default new Web3Provider()
