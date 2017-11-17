import Web3 from 'web3'
import EventEmitter from 'events'
import ProviderEngine from 'web3-provider-engine'
import TrezorWalletSubproviderFactory from 'ledger-wallet-provider'
import Web3Subprovider from 'web3-provider-engine/subproviders/web3'
import FilterSubprovider from 'web3-provider-engine/subproviders/filters'

const DEFAULT_DERIVATION_PATH = `44'/60'/0'/0/0`
const LEDGER_TTL = 1500

class TrezorProvider extends EventEmitter {
  constructor () {
    super()
    this._derivationPath = DEFAULT_DERIVATION_PATH
    this._trezorSubprovider = null
    this._trezor = null
    this._engine = null

    this._isInited = false
    this._timer = null
    this._syncing = this._syncing.bind(this)
  }

  async init () {
    if (this._isInited) {
      return
    }
    try {
      this._engine = new ProviderEngine()
      this._web3 = new Web3(this._engine)
      this._TrezorSubprovider = await TrezorWalletSubproviderFactory(this._derivationPath, this._web3, 'trezor')
      this._trezor = this._TrezorSubprovider.trezor
      this._isInited = true
    } catch (e) {
      // eslint-disable-next-line
      console.error('Trezor init error', e.message)
      this._isInited = false
    }
    return this._isInited
  }

  setupAndStart (providerURL) {
    this._engine.addProvider(this._TrezorSubprovider)
    this._engine.addProvider(new FilterSubprovider())
    this._engine.addProvider(new Web3Subprovider(new Web3.providers.HttpProvider(providerURL)))
    this._engine.start()
  }

  isU2F () {
    return true
  }

  _getAppConfig () {
    // we check for version for define is ETH opened.
    // If its true we get version number in callback
    return new Promise(resolve => {
      this._trezor.getAppConfig((error, data) => {
        if (error) {
          resolve(false)
        }
        resolve(!!data)
      }, LEDGER_TTL)
    })
  }

  _syncing = async () => {
    if (this._trezor.connectionOpened) {
      // already busy
      return
    }

    const newState = await this._getAppConfig()
  }

  async sync () {
    let isSync
    try {
      await this._syncing()
      this._timer = setInterval(this._syncing, 2000)
      isSync = true
    } catch (e) {
      isSync = false
      clearInterval(this._timer)
    }
    return isSync
  }

  async fetchAccount () {
    console.log('redux fetch account')
    console.log(this)
    return new Promise(resolve => {
      let timer = setInterval(() => {
        clearInterval(timer)
        this._trezor.getAccounts((error, data) => {
          if (error) {
            resolve(null)
          }
          resolve(data)
        })
      }, 200)
    })
  }

  stop () {
    this.removeAllListeners()
    clearInterval(this._timer)
    this._timer = null
  }

  getWeb3 () {
    return this._web3
  }

  getProvider () {
    return this._engine
  }
}

export default new TrezorProvider()
