/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

// #region imports

import contractsManagerDAO from '@chronobank/core/dao/ContractsManagerDAO'
import { DUCK_PERSIST_ACCOUNT } from '@chronobank/core/redux/persistAccount/constants'
import { AccountCustomNetwork } from '@chronobank/core/models/wallet/persistAccount'
import EventEmitter from 'events'
import {
  addError,
  clearErrors,
  loading,
  networkSetNetwork,
  networkResetNetwork,
  networkSetProvider,
} from '../redux/network/actions'
import { utils as web3Converter } from '../settings'
import metaMaskResolver from './metaMaskResolver'
import { NETWORK_STATUS_OFFLINE, NETWORK_STATUS_ONLINE } from './MonitorService'
import privateKeyProvider from './privateKeyProvider'
import {
  getNetworkById,
  getNetworksByProvider,
  getScannerById,
  LOCAL_ID,
  LOCAL_PRIVATE_KEYS,
  LOCAL_PROVIDER_ID,
  NETWORK_MAIN_ID,
} from './settings'
import uportProvider, { UPortAddress } from './uportProvider'
import web3Provider from './Web3Provider'
import setup from './EngineUtils'

//#endregion imports

//#region CONSTANTS

import {
  DUCK_NETWORK,
  NETWORK_ADD_ERROR,
  NETWORK_SELECT_ACCOUNT,
  NETWORK_SET_ACCOUNTS,
  NETWORK_SET_TEST_METAMASK,
} from '../redux/network/constants'

//#endregion CONSTANTS

// TODO: to ad I18n translation
const ERROR_NO_ACCOUNTS = 'Couldn\'t get any accounts! Make sure your Ethereum client is configured correctly.'

class NetworkService extends EventEmitter {
  connectStore (store) {
    this._store = store
    this._dispatch = store.dispatch
  }

  // connectStore (store) {
  //   this._store = store
  //   this._dispatch = store.dispatch
  // }

  createNetworkSession = (account, provider, network) => {
    if (!this._account) {
      this._account = account
    }

    if (!account || !provider || !network) {
      throw new Error(`Wrong session arguments: account: ${account}, provider: ${provider}, network: ${network}`)
    }
    // const accounts = this._store.getState().get(DUCK_NETWORK).accounts || []
    //if (!accounts.includes(account)) {
    //  throw new Error('Account not registered')
    //}
    //console.log(account)
    //console.log(provider)

    //web3Provider.resolve()

    // sync with session state
    // this unlock login
    // dispatch(createSession(account))
    this.emit('createSession', {
      account, provider, network, dispatch: this._dispatch,
    })
  }

  async destroyNetworkSession (lastURL, isReset = true) {
    if (isReset) {
      // for tests
      web3Provider.beforeReset()
      web3Provider.afterReset()
    }

    this.emit('destroySession', { lastURL, dispatch: this._dispatch })
  }

  async checkLocalSession (account, providerURL) {
    const isTestRPC = await this.checkTestRPC(providerURL)
    // testRPC must be exists
    if (!isTestRPC || !account) {
      return false
    }

    // contacts and network must be valid
    const isDeployed = await this.checkNetwork()
    if (!isDeployed) {
      return false
    }

    // all tests passed
    return true
  }

  async checkNetwork () {
    const dispatch = this._dispatch
    dispatch(loading())
    const isDeployed = await contractsManagerDAO.isDeployed()
    if (!isDeployed) {
      dispatch({
        type: NETWORK_ADD_ERROR,
        error: 'Network is unavailable.',
      })
    }
    //return isDeployed
    return true
  }

  selectProvider = (selectedProviderId) => {
    const dispatch = this._dispatch
    dispatch(networkResetNetwork())
    dispatch(networkSetProvider(selectedProviderId))
  }

  selectNetwork = (selectedNetworkId) => {
    this._dispatch(networkSetNetwork(selectedNetworkId))
  }

  async loginUport () {
    const dispatch = this._dispatch
    const provider = uportProvider.getUportProvider()
    dispatch(loading())
    dispatch(clearErrors())
    web3Provider.reinit(provider.getWeb3(), provider.getProvider())
    const encodedAddress: string = await provider.requestAddress()
    const { network, address }: UPortAddress = uportProvider.decodeMNIDaddress(encodedAddress)
    dispatch(this.selectNetwork(web3Converter.hexToDecimal(network)))
    dispatch({ type: NETWORK_SET_ACCOUNTS, accounts: [address] })
    this.selectAccount(address)
  }

  async loadAccounts () {
    const dispatch = this._dispatch
    dispatch(loading())
    dispatch({ type: NETWORK_SET_ACCOUNTS, accounts: [] })
    try {
      let accounts = this._accounts
      if (accounts == null) {
        accounts = await web3Provider.getAccounts()
      }
      if (!accounts || accounts.length === 0) {
        throw new Error(ERROR_NO_ACCOUNTS)
      }
      dispatch({ type: NETWORK_SET_ACCOUNTS, accounts })
      if (accounts.length === 1) {
        this.selectAccount(accounts[0])
      }
      dispatch(loading(false))
      return accounts
    } catch (e) {
      dispatch(addError(e.message))
    }
  }

  async restoreLocalSession (account, wallets) {
    this.selectProvider(LOCAL_PROVIDER_ID)
    this.selectNetwork(LOCAL_ID)
    const accounts = await this.loadAccounts()
    this.selectAccount(account)

    const index = Math.max(accounts.indexOf(account), 0)
    const provider = privateKeyProvider.getPrivateKeyProvider(LOCAL_PRIVATE_KEYS[index], this.getProviderSettings(), wallets)
    await setup(provider)
  }

  selectAccount = (selectedAccount) => {
    this._dispatch({ type: NETWORK_SELECT_ACCOUNT, selectedAccount })
  }

  setAccounts = (accounts) => {
    this._accounts = accounts
  }

  getScanner = (networkId, providerId, api) => getScannerById(networkId, providerId, api)

  getProviderSettings = () => {
    const state = this._store.getState()

    const { customNetworksList } = state.get(DUCK_PERSIST_ACCOUNT)
    const { selectedNetworkId, selectedProviderId, isLocal } = state.get(DUCK_NETWORK)
    const network = getNetworkById(selectedNetworkId, selectedProviderId, isLocal)

    const { protocol, host } = network

    if (!host) {

      const customNetwork: AccountCustomNetwork = customNetworksList.find((network) => network.id === selectedNetworkId)

      return {
        network: customNetwork,
        url: customNetwork && customNetwork.url,
      }
    }

    return {
      network,
      url: protocol ? `${protocol}://${host}` : `//${host}`,
    }
  }

  getProviderURL = () => {
    const state = this._store.getState()
    const { customNetworksList } = state.get(DUCK_PERSIST_ACCOUNT)
    const { selectedNetworkId, selectedProviderId, isLocal } = state.get(DUCK_NETWORK)
    const { protocol, host } = getNetworkById(selectedNetworkId, selectedProviderId, isLocal)

    if (!host) {

      const customNetwork: AccountCustomNetwork = customNetworksList.find((network) => network.id === selectedNetworkId)

      return customNetwork && customNetwork.url
    }
    return protocol ? `${protocol}://${host}` : `//${host}`
  }

  getName = () => {
    const state = this._store.getState()
    const { customNetworksList } = state.get(DUCK_PERSIST_ACCOUNT)
    const { selectedNetworkId, selectedProviderId, isLocal } = state.get(DUCK_NETWORK)
    const network = getNetworkById(selectedNetworkId, selectedProviderId, isLocal)

    const { name } = network

    if (!network.host) {

      const customNetwork: AccountCustomNetwork = customNetworksList.find((network) => network.id === selectedNetworkId)

      return customNetwork && customNetwork.name
    }

    return name
  }

  checkMetaMask = () => {
    metaMaskResolver
      .on('resolve', (isMetaMask) => {
        try {
          if (isMetaMask) {
            this._dispatch({ type: NETWORK_SET_TEST_METAMASK })
            this.isMetamask = true
          }
        } catch (e) {
          // eslint-disable-next-line
          console.error(e)
        }
      })
      .start()
  }

  isMetaMask = () => {
    return this.isMetamask
  }

  async checkTestRPC (/*providerUrl*/) {
    return false
  }

  async autoSelect () {
    const { priority, preferMainnet } = this._store.getState().get(DUCK_NETWORK)
    const resolveNetwork = () => {
      // const web3 = new Web3()
      // web3Provider.reinit(web3, web3Utils.createStatusEngine(this.getProviderURL()))
      // web3Provider.resolve()
    }
    const selectAndResolve = (networkId, providerId) => {
      this.selectProvider(providerId)
      this.selectNetwork(networkId)
      resolveNetwork()
    }

    this.checkerIndex = 0

    this.checkers = []

    const handleNetwork = (status) => {
      switch (status) {
        case NETWORK_STATUS_OFFLINE:
          runNextChecker()
          break
        case NETWORK_STATUS_ONLINE:
          resetCheckers()
          break
      }
    }

    const resetCheckers = () => {
      this.checkerIndex = 0
      this.checkers.length = this.checkerIndex
      web3Provider.getMonitorService().removeListener('network', handleNetwork)
    }

    const runNextChecker = () => {
      if (this.checkerIndex < this.checkers.length) {
        web3Provider.beforeReset()
        web3Provider.afterReset()
        this.checkers[this.checkerIndex]()
        this.checkerIndex++
      } else {
        resetCheckers()
      }
    }

    priority.forEach((providerId) => {
      const networks = getNetworksByProvider(providerId)
      if (preferMainnet) {
        this.checkers.push(() => selectAndResolve(NETWORK_MAIN_ID, providerId))
      } else {
        networks
          .filter((network) => network.id !== NETWORK_MAIN_ID)
          .forEach((network) => {
            this.checkers.push(() => selectAndResolve(network.id, providerId))
          })
      }
    })

    web3Provider.getMonitorService()
      .on('network', handleNetwork)
    runNextChecker()
  }

  login (account) {
    this._account = account
    this.emit('login', { account: this._account, dispatch: this._dispatch })
  }

  getCurrentNetwork () {
    const { selectedNetworkId } = this._store.getState().get(DUCK_NETWORK)
    return selectedNetworkId
  }

  getCurrentProvider () {
    const { selectedProviderId } = this._store.getState().get(DUCK_NETWORK)
    return selectedProviderId
  }
}

export default new NetworkService()
