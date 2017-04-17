import {
  NETWORK_SET_ACCOUNTS,
  NETWORK_SET_WEB3,
  NETWORK_CLEAR_ERRORS,
  NETWORK_ADD_ERROR,
  NETWORK_SELECT_ACCOUNT,
  NETWORK_SET_TEST_RPC
} from './networkReducer'
import web3Provider from '../../network/Web3Provider'
import localStorageKeys from '../../constants/localStorageKeys'
import Web3 from 'web3'
import Web3ProvidersName from '../../network/Web3ProviderNames'
import uportProvider from '../../network/UportProvider'

const checkTestRPC = () => (dispatch) => {
  const web3 = new Web3()
  web3.setProvider(new web3.providers.HttpProvider('http://localhost:8545'))
  try {
    web3.eth.getBlock(0, (err, result) => {
      if (!err && result && result.hash) {
        return dispatch({type: NETWORK_SET_TEST_RPC, isTestRPC: true})
      }
      return dispatch({type: NETWORK_SET_TEST_RPC, isTestRPC: false})
    })
  } catch (e) {
    dispatch({type: NETWORK_SET_TEST_RPC, isTestRPC: false})
  }
}

const setWeb3Provider = (providerName: string) => (dispatch) => {
  let web3, provider
  switch (providerName) {
    case Web3ProvidersName.UPORT:
      web3 = uportProvider.getWeb3()
      provider = uportProvider.getProvider()
      break
    case Web3ProvidersName.METAMASK:
      web3 = window.web3
      provider = window.web3.currentProvider
      break
    case Web3ProvidersName.LOCAL:
    default:
      web3 = new Web3()
      provider = new Web3.providers.HttpProvider('http://localhost:8545')
  }

  web3Provider.setWeb3(web3)
  web3Provider.setProvider(provider)

  window.localStorage.setItem(localStorageKeys.CHRONOBANK_WEB3_PROVIDER, providerName)
  dispatch({type: NETWORK_SET_WEB3, providerName})
}

const clearWeb3Provider = () => (dispatch) => {
  window.localStorage.removeItem(localStorageKeys.CHRONOBANK_WEB3_PROVIDER)
  dispatch({type: NETWORK_SET_WEB3, providerName: null})
  dispatch({type: NETWORK_SET_ACCOUNTS, accounts: []})
}

const clearErrors = () => (dispatch) => {
  dispatch({type: NETWORK_CLEAR_ERRORS})
}

const selectAccount = (selectedAccount) => (dispatch) => {
  dispatch({type: NETWORK_SELECT_ACCOUNT, selectedAccount})
}

const loadAccounts = () => (dispatch) => {
  dispatch({type: NETWORK_SET_ACCOUNTS, accounts: []})
  const web3 = web3Provider.getWeb3instance()
  web3.eth.getAccounts((error, accounts) => {
    if (error !== null) {
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
  })
}

export {
  setWeb3Provider,
  loadAccounts,
  selectAccount,
  clearWeb3Provider,
  checkTestRPC,
  clearErrors
}
