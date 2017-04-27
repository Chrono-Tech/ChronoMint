import {
  NETWORK_SET_ACCOUNTS,
  NETWORK_CLEAR_ERRORS,
  NETWORK_ADD_ERROR,
  NETWORK_SELECT_ACCOUNT,
  NETWORK_SET_TEST_RPC,
  NETWORK_SET_TEST_METAMASK,
  NETWORK_SET_NETWORK,
  NETWORK_SET_PROVIDER
} from './networkReducer'
import web3Provider from '../../network/Web3Provider'
import Web3 from 'web3'
import LS from '../../dao/LocalStorageDAO'
import metaMaskResolver from '../../network/MetaMaskResolver'
import ChronoMintDAO from '../../dao/ChronoMintDAO'
import { login } from '../session/actions'
import { providerMap } from '../../network/networkSettings'

const setWeb3 = (providerId) => {
  let web3

  switch (providerId) {
    case providerMap.metamask.id:
      web3 = window.web3
      break
    default:
      web3 = new Web3()
  }

  web3Provider.setWeb3(web3)
}

export const setWeb3Provider = (providerId) => {
  let provider
  switch (providerId) {
    case providerMap.metamask.id:
      provider = window.web3.currentProvider
      break
    default:
      provider = new Web3.providers.HttpProvider('http://localhost:8545')
  }
  web3Provider.setProvider(provider)
}

const checkNetworkAndLogin = (account) => (dispatch) => {
  const web3 = web3Provider.getWeb3instance()
  ChronoMintDAO.isContractDeployed(web3, account).then((isContractDeployed) => {
    if (isContractDeployed) {
      web3Provider.resolve()
      dispatch(login(account))
    } else {
      dispatch({
        type: NETWORK_ADD_ERROR,
        error: 'ChronoMint contracts has not been deployed to this network.'
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
      if (hasHash) {
        dispatch({type: NETWORK_SET_TEST_RPC})
      }
      return resolve()
    })
  })
}

const checkMetaMask = () => (dispatch) => {
  return metaMaskResolver().then((isMetaMask) => {
    isMetaMask && dispatch({type: NETWORK_SET_TEST_METAMASK})
  })
}

// TODO @dkchv: update this
const clearWeb3Provider = () => (dispatch) => {
  LS.setWeb3Provider(undefined, null)
  LS.setNetworkId(undefined, null)
  dispatch({type: NETWORK_SET_PROVIDER, selectedProviderId: null})
  dispatch({type: NETWORK_SET_ACCOUNTS, accounts: []})
  dispatch({type: NETWORK_CLEAR_ERRORS})
}

const selectNetwork = (selectedNetworkId) => (dispatch) => {
  LS.setNetworkId(selectedNetworkId)
  dispatch({type: NETWORK_SET_NETWORK, selectedNetworkId})
}

const selectProvider = (selectedProviderId) => (dispatch) => {
  LS.clear()
  dispatch({type: NETWORK_SET_NETWORK, networkId: null})
  LS.setWeb3Provider(selectedProviderId)
  dispatch({type: NETWORK_SET_PROVIDER, selectedProviderId})
}

const addError = (error) => (dispatch) => {
  dispatch({
    type: NETWORK_ADD_ERROR,
    error
  })
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

const relogin = (providerId:number, networkId:number, account, isCbe = false) => (dispatch) => {
  dispatch({type: NETWORK_SET_NETWORK, networkId})
  dispatch({type: NETWORK_SET_PROVIDER, providerId})
  dispatch({type: NETWORK_SELECT_ACCOUNT, account})
  setWeb3(providerId)
  setWeb3Provider(providerId)
  web3Provider.resolve()
  dispatch(login(account, false, isCbe))
}

export {
  loadAccounts,
  selectAccount,
  clearWeb3Provider,
  checkTestRPC,
  checkMetaMask,
  checkNetworkAndLogin,
  relogin,
  selectNetwork,
  selectProvider,
  addError,
  clearErrors
}
