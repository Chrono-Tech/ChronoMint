import {
  NETWORK_SET_ACCOUNTS,
  NETWORK_CLEAR_ERRORS,
  NETWORK_ADD_ERROR,
  NETWORK_SELECT_ACCOUNT,
  NETWORK_SET_TEST_RPC,
  NETWORK_SET_TEST_METAMASK,
  NETWORK_SET_NETWORK,
  NETWORK_SET_PROVIDER
} from './reducer'
import web3Provider from '../../network/Web3Provider'
import Web3 from 'web3'
import LS from '../../dao/LocalStorageDAO'
import metaMaskResolver from '../../network/MetaMaskResolver'
import ChronoMintDAO from '../../dao/ChronoMintDAO'
import { login } from '../session/actions'

const checkNetworkAndLogin = (account) => (dispatch) => {
  const web3 = web3Provider.getWeb3instance()
  ChronoMintDAO.isContractDeployed(web3, account).then((isContractDeployed) => {
    if (isContractDeployed) {
      web3Provider.resolve()
      dispatch(login(account, true))
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
  web3.setProvider(new web3.providers.HttpProvider('//localhost:8545'))

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
  dispatch({type: NETWORK_ADD_ERROR, error})
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

export {
  loadAccounts,
  selectAccount,
  checkTestRPC,
  checkMetaMask,
  checkNetworkAndLogin,
  selectNetwork,
  selectProvider,
  addError,
  clearErrors
}
