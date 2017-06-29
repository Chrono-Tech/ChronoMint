import Web3 from 'web3'

import AbstractContractDAO from '../../dao/AbstractContractDAO'

import contractsManagerDAO from '../../dao/ContractsManagerDAO'
import ls from '../../utils/LocalStorage'

import web3Provider from '../../network/Web3Provider'
import metaMaskResolver from '../../network/metaMaskResolver'
import uportProvider, { decodeMNIDaddress } from '../../network/uportProvider'
import { LOCAL_ID } from '../../network/settings'

import { createSession, destroySession } from '../session/actions'


export const NETWORK_SET_ACCOUNTS = 'network/SET_ACCOUNTS'
export const NETWORK_SELECT_ACCOUNT = 'network/SELECT_ACCOUNT'
export const NETWORK_ADD_ERROR = 'network/ADD_ERROR'
export const NETWORK_CLEAR_ERRORS = 'network/CLEAR_ERRORS'
export const NETWORK_SET_TEST_RPC = 'network/SET_TEST_RPC'
export const NETWORK_SET_TEST_METAMASK = 'network/SET_TEST_METAMASK'
export const NETWORK_SET_NETWORK = 'network/SET_NETWORK'
export const NETWORK_SET_PROVIDER = 'network/SET_PROVIDER'

const ERROR_NO_ACCOUNTS = 'Couldn\'t get any accounts! Make sure your Ethereum client is configured correctly.'

export const checkNetwork = () => async (dispatch) => {
  const isDeployed = await contractsManagerDAO.isDeployed()
  if (!isDeployed) {
    dispatch({
      type: NETWORK_ADD_ERROR,
      error: 'ChronoMint contracts has not been deployed to this network.'
    })
  }
  return isDeployed
}

export const checkTestRPC = (providerUrl) => (dispatch) => {
  const web3 = new Web3()
  web3.setProvider(new web3.providers.HttpProvider(providerUrl || '//localhost:8545'))

  return new Promise(resolve => {
    return web3.eth.getBlock(0, (err, result) => {
      const hasHash = !err && result && !!result.hash
      if (hasHash) {
        dispatch({type: NETWORK_SET_TEST_RPC})
        return resolve(true)
      }
      resolve(false)
    })
  })
}

export const checkMetaMask = () => (dispatch) => {
  return metaMaskResolver().then((isMetaMask) => {
    isMetaMask && dispatch({type: NETWORK_SET_TEST_METAMASK})
  })
}

export const selectNetwork = (selectedNetworkId) => (dispatch) => {
  dispatch({type: NETWORK_SET_NETWORK, selectedNetworkId})
}

export const selectProvider = (selectedProviderId) => (dispatch) => {
  dispatch({type: NETWORK_SET_NETWORK, networkId: null})
  dispatch({type: NETWORK_SET_PROVIDER, selectedProviderId})
}

export const addError = (error) => (dispatch) => {
  dispatch({type: NETWORK_ADD_ERROR, error})
}

export const clearErrors = () => (dispatch) => {
  dispatch({type: NETWORK_CLEAR_ERRORS})
}

export const selectAccount = (selectedAccount) => (dispatch) => {
  dispatch({type: NETWORK_SELECT_ACCOUNT, selectedAccount})
}

export const loadAccounts = () => async (dispatch) => {
  dispatch({type: NETWORK_SET_ACCOUNTS, accounts: []})
  try {
    const accounts = await web3Provider.getAccounts()
    if (!accounts || accounts.length === 0) {
      throw new Error(ERROR_NO_ACCOUNTS)
    }
    dispatch({type: NETWORK_SET_ACCOUNTS, accounts})
    return accounts
  } catch (e) {
    dispatch(addError(e.message))
  }
}

export const loginUport = () => async (dispatch) => {
  dispatch(clearErrors())
  web3Provider.setWeb3(uportProvider.getWeb3())
  web3Provider.setProvider(uportProvider.getProvider())
  try {
    // do not use loadAccounts, fetched accounts are encoded
    const accounts = await web3Provider.getAccounts()
    if (!accounts || accounts.length === 0) {
      throw new Error(ERROR_NO_ACCOUNTS)
    }
    // decode first
    const decodedAccounts = accounts.map(item => decodeMNIDaddress(item).address)
    dispatch({type: NETWORK_SET_ACCOUNTS, accounts: decodedAccounts})
    dispatch(selectAccount(decodedAccounts[0]))
  } catch (e) {
    dispatch(addError(e.message))
  }
}

export const restoreLocalSession = (account) => async (dispatch) => {
  dispatch(selectProvider(LOCAL_ID))
  dispatch(selectNetwork(LOCAL_ID))
  await dispatch(loadAccounts())
  dispatch(selectAccount(account))
}

export const checkLocalSession = (account, providerURL) => async (dispatch) => {
  const isTestRPC = await dispatch(checkTestRPC(providerURL))
  // testRPC must be exists
  if (!isTestRPC || !account) {
    return false
  }

  const web3 = new Web3()
  web3Provider.setWeb3(web3)
  web3Provider.setProvider(new web3.providers.HttpProvider(providerURL || '//localhost:8545'))
  const accounts = await web3Provider.getAccounts()

  // account must be valid
  if (!accounts.includes(account)) {
    return false
  }

  // contacts and network must be valid
  const isDeployed = await dispatch(checkNetwork())
  if (!isDeployed) {
    return false
  }

  // all tests passed
  return true
}

export const createNetworkSession = (account, provider, network) => (dispatch, getState) => {
  if (!account || !provider || !network) {
    throw new Error('Wrong session arguments')
  }
  const accounts = getState().get('network').accounts || []
  if (!accounts.includes(account)) {
    throw new Error('Account not registered')
  }

  ls.createSession(account, provider, network)
  web3Provider.resolve()
  // sync with session state
  // this unlock login
  dispatch(createSession(account))
}

export const destroyNetworkSession = (lastURL, isReset = true) => async (dispatch) => {
  ls.setLastURL(lastURL)
  ls.destroySession()
  await AbstractContractDAO.stopWholeWatching()
  AbstractContractDAO.resetWholeFilterCache()
  if (isReset) {
    // for tests
    // TODO @dkchv: update this after research logout/relogin bug, which break web3
    web3Provider.reset()
  }
  dispatch(destroySession())
}
