import EventEmitter from 'events'
import Web3 from 'web3'
import resultCodes from 'chronobank-smart-contracts/common/errors'
import ls from 'utils/LocalStorage'
import web3Converter from 'utils/Web3Converter'
import web3Provider, { Web3Provider } from 'network/Web3Provider'
import uportProvider from 'network/uportProvider'
import { LOCAL_ID } from 'network/settings'
import { decodeMNIDaddress, UPortAddress } from 'network/uportProvider'
import metaMaskResolver from 'network/metaMaskResolver'
import { getNetworkById, getScannerById } from 'network/settings'
import SessionStorage from "utils/SessionStorage"
import contractsManagerDAO from 'dao/ContractsManagerDAO'
import AbstractContractDAO from 'dao/AbstractContractDAO'

export const NETWORK_LOADING = 'network/LOADING'
export const NETWORK_SET_ACCOUNTS = 'network/SET_ACCOUNTS'
export const NETWORK_SELECT_ACCOUNT = 'network/SELECT_ACCOUNT'
export const NETWORK_ADD_ERROR = 'network/ADD_ERROR'
export const NETWORK_CLEAR_ERRORS = 'network/CLEAR_ERRORS'
export const NETWORK_SET_TEST_RPC = 'network/SET_TEST_RPC'
export const NETWORK_SET_TEST_METAMASK = 'network/SET_TEST_METAMASK'
export const NETWORK_SET_NETWORK = 'network/SET_NETWORK'
export const NETWORK_SET_PROVIDER = 'network/SET_PROVIDER'

const ERROR_NO_ACCOUNTS = 'Couldn\'t get any accounts! Make sure your Ethereum client is configured correctly.'

export const loading = (isLoading = true) => (dispatch) => {
  dispatch({type: NETWORK_LOADING, isLoading})
}

export const addError = (error) => (dispatch) => {
  dispatch({type: NETWORK_ADD_ERROR, error})
}

export const clearErrors = () => (dispatch) => {
  dispatch({type: NETWORK_CLEAR_ERRORS})
}

class NetworkService extends EventEmitter {
  constructor () {
    super()
    this._account = SessionStorage.getAccount()
  }

  connectStore (store) {
    this._store = store
    this._dispatch = store.dispatch
  }

  createNetworkSession = (account, provider, network) => {
    if (!this._account) {
      SessionStorage.setAccount(account)
      this._account = account
    }

    if (!account || !provider || !network) {
      throw new Error('Wrong session arguments')
    }
    const accounts = this._store.getState().get('network').accounts || []
    if (!accounts.includes(account)) {
      throw new Error('Account not registered')
    }

    ls.createSession(account, provider, network)
    web3Provider.resolve()

    AbstractContractDAO.setup(account, [resultCodes.OK, true], resultCodes)

    // sync with session state
    // this unlock login
    // dispatch(createSession(account))
    this.emit('login', {account: this._account, dispatch: this._dispatch})
  }

  destroyNetworkSession = async (lastURL, isReset = true) => {
    ls.setLastURL(lastURL)
    ls.destroySession()
    await AbstractContractDAO.stopWholeWatching()
    AbstractContractDAO.resetWholeFilterCache()
    if (isReset) {
      // for tests
      web3Provider.reset()
    }

    this.emit('logout', {dispatch: this._dispatch})
  }

  checkLocalSession = async (account, providerURL) => {
    const isTestRPC = await this.checkTestRPC(providerURL)
    // testRPC must be exists
    if (!isTestRPC || !account) {
      return false
    }

    const web3 = new Web3()
    web3Provider.setWeb3(web3)
    web3Provider.setProvider(new web3.providers.HttpProvider(providerURL || ('//' + location.hostname + ':8545')))
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

  checkNetwork = async () => {
    const dispatch = this._dispatch
    dispatch(loading())
    const isDeployed = await contractsManagerDAO.isDeployed()
    if (!isDeployed) {
      dispatch({
        type: NETWORK_ADD_ERROR,
        error: 'Network is unavailable.'
      })
    }
    return isDeployed
  }

  selectProvider = (selectedProviderId) => {
    const dispatch = this._dispatch
    dispatch({type: NETWORK_SET_NETWORK, networkId: null})
    dispatch({type: NETWORK_SET_PROVIDER, selectedProviderId})
  }

  selectNetwork = (selectedNetworkId) => {
    this._dispatch({type: NETWORK_SET_NETWORK, selectedNetworkId})
  }

  loginUport = async () => {
    const dispatch = this._dispatch
    dispatch(loading())
    dispatch(clearErrors())
    web3Provider.setWeb3(uportProvider.getWeb3())
    web3Provider.setProvider(uportProvider.getProvider())
    const encodedAddress: string = await uportProvider.requestAddress()
    const {network, address}: UPortAddress = decodeMNIDaddress(encodedAddress)
    dispatch(this.selectNetwork(web3Converter.hexToDecimal(network)))
    dispatch({type: NETWORK_SET_ACCOUNTS, accounts: [address]})
    this.selectAccount(address)
  }

  loadAccounts = async () => {
    const dispatch = this._dispatch
    dispatch(loading())
    dispatch({type: NETWORK_SET_ACCOUNTS, accounts: []})
    try {
      const accounts = await web3Provider.getAccounts()
      if (!accounts || accounts.length === 0) {
        throw new Error(ERROR_NO_ACCOUNTS)
      }
      dispatch({type: NETWORK_SET_ACCOUNTS, accounts})
      if (accounts.length === 1) {
        this.selectAccount(accounts[0])
      }
      dispatch(loading(false))
      return accounts
    } catch (e) {
      dispatch(addError(e.message))
    }
  }

  restoreLocalSession = async (account) => {
    this.selectProvider(LOCAL_ID)
    this.selectNetwork(LOCAL_ID)
    await this.loadAccounts()
    this.selectAccount(account)
  }

  selectAccount = (selectedAccount) => {
    this._dispatch({type: NETWORK_SELECT_ACCOUNT, selectedAccount})
  }

  getScanner = () => {
    return getScannerById(ls.getNetwork(), ls.getProvider(), true)
  }

  getProviderSettings = () => {
    const state = this._store.getState()
    const {selectedNetworkId, selectedProviderId, isLocal} = state.get('network')
    const network = getNetworkById(selectedNetworkId, selectedProviderId, isLocal)
    const {protocol, host} = network

    return {
      network,
      url: protocol ? `${protocol}://${host}` : `//${host}`
    }
  }

  getProviderURL = () => {
    const state = this._store.getState()
    const {selectedNetworkId, selectedProviderId, isLocal} = state.get('network')
    const {protocol, host} = getNetworkById(selectedNetworkId, selectedProviderId, isLocal)
    return protocol ? `${protocol}://${host}` : `//${host}`
  }

  checkMetaMask = async () => {
    let isMetaMask
    try {
      isMetaMask = await metaMaskResolver()
      if (isMetaMask) {
        this._dispatch({type: NETWORK_SET_TEST_METAMASK})
      }
    } catch (e) {
      // eslint-disable-next-line
      console.error(e)
      isMetaMask = false
    }
    return isMetaMask
  }

  checkTestRPC = async (providerUrl) => {
    // http only
    if (window.location.protocol === 'https:') {
      return false
    }

    const web3 = new Web3()
    web3.setProvider(new web3.providers.HttpProvider(providerUrl || ('//' + location.hostname + ':8545')))
    const web3Provider = new Web3Provider(web3)

    const isDeployed = await contractsManagerDAO.isDeployed(web3Provider)
    if (!isDeployed) {
      return false
    }

    this._dispatch({type: NETWORK_SET_TEST_RPC})
    return true
  }
}


export default new NetworkService()
