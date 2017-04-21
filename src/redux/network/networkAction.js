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
import Web3ProviderNames from '../../network/Web3ProviderNames'
import uportProvider from '../../network/UportProvider'
import ls from '../../utils/localStorage'
import metaMaskResolver from '../../network/MetaMaskResolver'
import UserDAO from '../../dao/UserDAO'
import { login } from '../session/actions'

const checkNetworkAndLogin = (account) => (dispatch) => {
  const web3 = web3Provider.getWeb3instance()
  UserDAO.isContractDeployed(web3, account).then((isContractDeployed) => {
    if (isContractDeployed) {
      web3Provider.resolve()
      dispatch(login(account))
    } else {
      dispatch({
        type: NETWORK_ADD_ERROR,
        error: 'ChronoBank contracts has not been deployed to this network.'
      })
    }
  })
}

const checkTestRPC = () => (dispatch) => {
  const web3 = new Web3()
  web3.setProvider(new web3.providers.HttpProvider('http://localhost:8545'))

  return new Promise((resolve) => {
    web3.eth.getBlock(0, (err, result) => {
      const hasHash = !err && result && !!result.hash
      dispatch({type: NETWORK_SET_TEST_RPC, isTestRPC: hasHash})
      return resolve()
    })
  })
}

const checkMetaMask = () => (dispatch) => {
  metaMaskResolver().then((isMetaMask) => {
    dispatch({type: NETWORK_SET_TEST_METAMASK, isMetaMask})
  })
}

const setWeb3 = (providerName: Web3ProviderNames) => (dispatch) => {
  let web3

  switch (providerName) {
    case Web3ProviderNames.UPORT:
      web3 = uportProvider.getWeb3()
      break
    case Web3ProviderNames.METAMASK:
      web3 = window.web3
      break
    default:
      web3 = new Web3()
  }

  web3Provider.setWeb3(web3)
  ls(localStorageKeys.WEB3_PROVIDER, providerName)
  dispatch({type: NETWORK_SET_WEB3, providerName})
}

const setWeb3ProviderByName = (providerName: Web3ProviderNames) => (dispatch) => {
  let provider
  switch (providerName) {
    case Web3ProviderNames.UPORT:
      provider = uportProvider.getProvider()
      break
    case Web3ProviderNames.METAMASK:
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
        error: 'There was an error fetching your accounts.'
      })
    }
    if (!accounts || accounts.length === 0) {
      dispatch({
        type: NETWORK_ADD_ERROR,
        error: 'Couldn\'t get any accounts! Make sure your Ethereum client is configured correctly.'
      })
    }

    dispatch({type: NETWORK_SET_ACCOUNTS, accounts})
    resolve()
  }))
}

const relogin = (isCbe = false) => (dispatch) => {
  return new Promise((resolve) => {
    const account = ls(localStorageKeys.ACCOUNT)
    const providerName = ls(localStorageKeys.WEB3_PROVIDER)

    const canRelogin = providerName === Web3ProviderNames.LOCAL ||
      providerName === Web3ProviderNames.METAMASK ||
      providerName === Web3ProviderNames.UPORT

    if (!account || !canRelogin) {
      return resolve(false)
    }
    dispatch(setWeb3(providerName))
    dispatch(setWeb3ProviderByName(providerName))
    web3Provider.resolve()
    dispatch(login(account, false, isCbe)).then(() => {
      resolve(true)
    })
  })
}

export {
  setWeb3,
  setWeb3ProviderByName,
  loadAccounts,
  selectAccount,
  clearWeb3Provider,
  checkTestRPC,
  checkMetaMask,
  checkNetworkAndLogin,
  relogin
}
