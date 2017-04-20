import {
  NETWORK_SET_ACCOUNTS,
  NETWORK_SET_WEB3,
  NETWORK_CLEAR_ERRORS,
  NETWORK_ADD_ERROR,
  NETWORK_SELECT_ACCOUNT,
  NETWORK_SET_TEST_RPC,
  NETWORK_SET_TEST_METAMASK
} from './networkReducer'
import web3Provider from '../../network/Web3Provider'
import localStorageKeys from '../../constants/localStorageKeys'
import Web3 from 'web3'
import Web3ProvidersName from '../../network/Web3ProviderNames'
import uportProvider from '../../network/UportProvider'
import ls from '../../utils/localStorage'
import metaMaskResolver from '../../network/MetaMaskResolver'

const checkTestRPC = () => (dispatch) => {
  const web3 = new Web3()
  web3.setProvider(new web3.providers.HttpProvider('http://localhost:8545'))

  return new Promise((resolve) => {
    web3.eth.getBlock(0, (err, result) => {
      const hash = !err && result && result.hash
      dispatch({type: NETWORK_SET_TEST_RPC, isTestRPC: !!hash})
      return resolve()
    })
  })
}

const checkMetaMask = () => (dispatch) => {
  metaMaskResolver().then((isMetaMask) => {
    dispatch({type: NETWORK_SET_TEST_METAMASK, isMetaMask})
  })
}

const setWeb3 = (providerName:Web3ProvidersName) => (dispatch) => {
  let web3

  switch (providerName) {
    case Web3ProvidersName.UPORT:
      web3 = uportProvider.getWeb3()
      break
    case Web3ProvidersName.METAMASK:
      web3 = window.web3
      break
    default:
      web3 = new Web3()
  }

  web3Provider.setWeb3(web3)
  ls(localStorageKeys.WEB3_PROVIDER, providerName)
  dispatch({type: NETWORK_SET_WEB3, providerName})
}

const setWeb3ProviderByName = (providerName:Web3ProvidersName) => (dispatch) => {
  let provider
  switch (providerName) {
    case Web3ProvidersName.UPORT:
      provider = uportProvider.getProvider()
      break
    case Web3ProvidersName.METAMASK:
      provider = window.web3.currentProvider
      break
    default:
      provider = new Web3.providers.HttpProvider('http://localhost:8545')
  }
  web3Provider.setProvider(provider)
}

const clearWeb3Provider = () => (dispatch) => {
  ls.remove(localStorageKeys.WEB3_PROVIDER)
  dispatch({type: NETWORK_SET_WEB3, providerName: null})
  dispatch({type: NETWORK_SET_ACCOUNTS, accounts: []})
  dispatch({type: NETWORK_CLEAR_ERRORS})
}

const selectAccount = (selectedAccount) => (dispatch) => {
  dispatch({type: NETWORK_SELECT_ACCOUNT, selectedAccount})
}

const loadAccounts = () => (dispatch) => {
  dispatch({type: NETWORK_SET_ACCOUNTS, accounts: []})
  const web3 = web3Provider.getWeb3instance()
  return new Promise(resolve => web3.eth.getAccounts((error, accounts) => {
    if (error) {
      dispatch({
        type: NETWORK_ADD_ERROR,
        error: {
          message: 'There was an error fetching your accounts.'
        }
      })
    }
    if (!accounts || accounts.length === 0) {
      dispatch({
        type: NETWORK_ADD_ERROR,
        error: {
          message: 'Couldn\'t get any accounts! Make sure your Ethereum client is configured correctly.'
        }
      })
    }

    dispatch({type: NETWORK_SET_ACCOUNTS, accounts})
    resolve()
  }))
}

export {
  setWeb3,
  setWeb3ProviderByName,
  loadAccounts,
  selectAccount,
  clearWeb3Provider,
  checkTestRPC,
  checkMetaMask
}
