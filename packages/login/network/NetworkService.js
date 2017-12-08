import AbstractContractDAO from 'dao/AbstractContractDAO'
import contractsManagerDAO from 'dao/ContractsManagerDAO'
import EventEmitter from 'events'
import Web3 from 'web3'
import { utils } from '../settings'
import { loading, clearErrors, addError, NETWORK_ADD_ERROR, NETWORK_SELECT_ACCOUNT, NETWORK_SET_NETWORK, NETWORK_SET_ACCOUNTS, NETWORK_SET_PROVIDER, NETWORK_SET_TEST_METAMASK, NETWORK_SET_TEST_RPC } from '../redux/network/actions'
import metaMaskResolver from './metaMaskResolver'
import { NETWORK_STATUS_OFFLINE, NETWORK_STATUS_ONLINE } from './MonitorService'
import { getNetworkById, getNetworksByProvider, getScannerById, LOCAL_ID, NETWORK_MAIN_ID, TESTRPC_URL } from './settings'
import uportProvider, { UPortAddress } from './uportProvider'
import web3Provider, { Web3Provider } from './Web3Provider'
import web3Utils from './Web3Utils'

const { web3Converter } = utils

const ERROR_NO_ACCOUNTS = 'Couldn\'t get any accounts! Make sure your Ethereum client is configured correctly.'

class NetworkService extends EventEmitter {
  connectStore (store) {
    this._store = store
    this._dispatch = store.dispatch
  }

  createNetworkSession = (account, provider, network) => {
    if (!this._account) {
      this._account = account
    }

    if (!account || !provider || !network) {
      throw new Error('Wrong session arguments')
    }
    const accounts = this._store.getState().get('network').accounts || []
    if (!accounts.includes(account)) {
      throw new Error('Account not registered')
    }

    web3Provider.resolve()

    AbstractContractDAO.setup(account)

    // sync with session state
    // this unlock login
    // dispatch(createSession(account))
    this.emit('createSession', {
      account, provider, network, dispatch: this._dispatch,
    })
  }

  async destroyNetworkSession (lastURL, isReset = true) {
    await AbstractContractDAO.stopWholeWatching()
    AbstractContractDAO.resetWholeFilterCache()
    if (isReset) {
      // for tests
      web3Provider.reset()
    }

    this.emit('destroySession', { lastURL, dispatch: this._dispatch })
  }

  async checkLocalSession (account, providerURL) {
    const isTestRPC = await this.checkTestRPC(providerURL)
    // testRPC must be exists
    if (!isTestRPC || !account) {
      return false
    }

    const web3 = new Web3()
    web3Provider.setWeb3(web3)
    web3Provider.setProvider(new web3.providers.HttpProvider(providerURL || TESTRPC_URL))
    const accounts = await web3Provider.getAccounts()

    // account must be valid
    if (!accounts.includes(account)) {
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
    return isDeployed
  }

  selectProvider = (selectedProviderId) => {
    const dispatch = this._dispatch
    dispatch({ type: NETWORK_SET_NETWORK, networkId: null })
    dispatch({ type: NETWORK_SET_PROVIDER, selectedProviderId })
  }

  selectNetwork = (selectedNetworkId) => {
    this._dispatch({ type: NETWORK_SET_NETWORK, selectedNetworkId })
  }

  async loginUport () {
    const dispatch = this._dispatch
    const provider = uportProvider.getUportProvider()
    dispatch(loading())
    dispatch(clearErrors())
    web3Provider.setWeb3(provider.getWeb3())
    web3Provider.setProvider(provider.getProvider())
    const encodedAddress: string = await provider.requestAddress()
    const { network, address }: UPortAddress = uportProvider.decodeMNIDaddress(encodedAddress)
    dispatch(this.selectNetwork(web3Converter.hexToDecimal(network)))
    dispatch({ type: NETWORK_SET_ACCOUNTS, accounts: [ address ] })
    this.selectAccount(address)
  }

  async loadAccounts () {
    const dispatch = this._dispatch
    dispatch(loading())
    dispatch({ type: NETWORK_SET_ACCOUNTS, accounts: [] })
    try {
      const accounts = await web3Provider.getAccounts()
      if (!accounts || accounts.length === 0) {
        throw new Error(ERROR_NO_ACCOUNTS)
      }
      dispatch({ type: NETWORK_SET_ACCOUNTS, accounts })
      if (accounts.length === 1) {
        this.selectAccount(accounts[ 0 ])
      }
      dispatch(loading(false))
      return accounts
    } catch (e) {
      dispatch(addError(e.message))
    }
  }

  async restoreLocalSession (account) {
    this.selectProvider(LOCAL_ID)
    this.selectNetwork(LOCAL_ID)
    await this.loadAccounts()
    this.selectAccount(account)
  }

  selectAccount = (selectedAccount) => {
    this._dispatch({ type: NETWORK_SELECT_ACCOUNT, selectedAccount })
  }

  getScanner = (params) => getScannerById(...params)

  getProviderSettings = () => {
    const state = this._store.getState()
    const { selectedNetworkId, selectedProviderId, isLocal } = state.get('network')
    const network = getNetworkById(selectedNetworkId, selectedProviderId, isLocal)
    const { protocol, host } = network

    return {
      network,
      url: protocol ? `${protocol}://${host}` : `//${host}`,
    }
  }

  getProviderURL = () => {
    const state = this._store.getState()
    const { selectedNetworkId, selectedProviderId, isLocal } = state.get('network')
    const { protocol, host } = getNetworkById(selectedNetworkId, selectedProviderId, isLocal)
    return protocol ? `${protocol}://${host}` : `//${host}`
  }

  checkMetaMask = () => {
    metaMaskResolver
      .on('resolve', (isMetaMask) => {
        try {
          if (isMetaMask) {
            this._dispatch({ type: NETWORK_SET_TEST_METAMASK })
          }
        } catch (e) {
          // eslint-disable-next-line
          console.error(e)
        }
      })
      .start()
  }

  async checkTestRPC (providerUrl) {
    const web3 = new Web3()
    web3.setProvider(new web3.providers.HttpProvider(providerUrl || TESTRPC_URL))
    const web3Provider = new Web3Provider(web3)

    const isDeployed = await contractsManagerDAO.isDeployed(web3Provider)
    if (!isDeployed) {
      return false
    }

    this._dispatch({ type: NETWORK_SET_TEST_RPC })
    return true
  }

  async autoSelect () {
    const { priority, preferMainnet } = this._store.getState().get('network')
    const resolveNetwork = () => {
      const web3 = new Web3()
      web3Provider.setWeb3(web3)
      web3Provider.setProvider(web3Utils.createStatusEngine(this.getProviderURL()))
      web3Provider.resolve()
    }
    const selectAndResolve = (networkId, providerId) => {
      this.selectProvider(providerId)
      this.selectNetwork(networkId)
      resolveNetwork()
    }
    let checkerIndex = 0

    const checkers = []

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
      checkerIndex = 0
      checkers.length = checkerIndex
      web3Provider.getMonitorService().removeListener('network', handleNetwork)
    }

    const runNextChecker = () => {
      if (checkerIndex <= checkers.length) {
        checkers[ checkerIndex ]()
        checkerIndex++
      } else {
        resetCheckers()
      }
    }

    priority.forEach((providerId) => {
      const networks = getNetworksByProvider(providerId)
      if (preferMainnet) {
        checkers.push(() => selectAndResolve(NETWORK_MAIN_ID, providerId))
      } else {
        networks
          .filter((network) => network.id !== NETWORK_MAIN_ID)
          .forEach((network) => {
            checkers.push(() => selectAndResolve(network.id, providerId))
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
}

export default new NetworkService()
