/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import EventEmitter from 'events'
import LedgerWalletSubproviderFactory from 'ledger-wallet-provider'
import Web3 from 'web3'
import ProviderEngine from 'web3-provider-engine'
import FilterSubprovider from 'web3-provider-engine/subproviders/filters'
import RpcSubprovider from 'web3-provider-engine/subproviders/rpc'
import EthereumEngine from './EthereumEngine'
import { byEthereumNetwork } from './NetworkProvider'
import HardwareWallet from './HardwareWallet'

const DEFAULT_DERIVATION_PATH = ["44'/60'/0'/0"]
const LEDGER_TTL = 1500

class LedgerProvider extends EventEmitter {
  constructor () {
    super()
    this._derivationPath = DEFAULT_DERIVATION_PATH
    this._ledgerSubprovider = null
    this._ledger = null
    this._engine = null
    this._wallet = null

    this._isInited = false
    this._timer = null
    this._isETHOpened = false
  }

  init = async () => {
    if (this._isInited) {
      return
    }
    try {
      this._engine = new ProviderEngine()
      this._web3 = new Web3(this._engine)
      this._ledgerSubprovider = await LedgerWalletSubproviderFactory(this._derivationPath, this._web3, 'ledger')
      this._ledger = this._ledgerSubprovider.ledger
      this._isInited = true
    } catch (e) {
      // eslint-disable-next-line
      console.error('Ledger init error', e.message)
      this._isInited = false
    }
    return this._isInited
  }

  setupAndStart = (providerURL) => {
    this._engine.addProvider(new FilterSubprovider())
    this._engine.addProvider(this._ledgerSubprovider)
    this._engine.addProvider(new RpcSubprovider({ rpcUrl: providerURL }))
    this._engine.start()
  }

  isU2F = () => {
    return this._ledgerSubprovider.isSupported
  }

  isETHAppOpened = () => {
    return this._isETHOpened
  }

  _getAppConfig = (): Promise => {
    // we check for version for define is ETH opened.
    // If its true we get version number in callback
    return new Promise((resolve) => {
      this._ledger.getAppConfig((error, data) => {
        if (error) {
          resolve(false)
        }
        resolve(!!data)
      }, LEDGER_TTL)
    })
  }

  _syncing = async () => {
    if (this._ledger.connectionOpened) {
      // already busy
      return
    }

    const newState = await this._getAppConfig()
    if (newState !== this._isETHOpened) {
      this.emit('connection', newState)
    }
    this._isETHOpened = newState
  }

  sync = async () => {
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

  fetchAccount = async () => {
    return new Promise((resolve) => {
      this._ledger.getAccounts((error, accounts) => {
        if (error) {
          resolve(null)
        }
        this._wallet = new HardwareWallet(accounts)
        resolve(accounts)
      })
    })
  }

  setWallet = (account) => {
    this._wallet = new HardwareWallet(account)
  }

  stop = () => {
    this.removeAllListeners()
    clearInterval(this._timer)
    this._timer = null
  }

  getWeb3 = () => {
    return this._web3
  }

  getProvider = () => {
    return this._engine
  }

  getNetworkProvider = ({ url, network } = {}) => {
    return {
      networkCode: byEthereumNetwork(network),
      ethereum: new EthereumEngine(this._wallet, network, url, this._engine),
    }
  }
}

export default new LedgerProvider()
