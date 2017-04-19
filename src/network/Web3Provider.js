
class Web3Provider {
  _web3Promise = null
  _web3instance = null
  _resolveCallback = null
  _resetCallbacks = []

  constructor () {
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
      throw new Error('Web3 is undefined. Please use setWeb3() first.')
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
      throw new Error('Web3 is undefined. Please use setWeb3() first.')
    }
    web3.setProvider(provider)
  }

  onReset (callback) {
    this._resetCallbacks.push(callback)
  }

  reset () {
    // unsubcribe filters
    this._web3instance.reset(false)
    this._web3Promise = this._getWeb3Promise()
    this._web3instance = null

    const resetCallbacks = this._resetCallbacks
    this._resetCallbacks = []
    resetCallbacks.forEach((callback) => callback())
  }
}

export default new Web3Provider()
