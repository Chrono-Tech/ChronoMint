/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import {
  createWallet,
  resetPasswordWallet,
  validateMnemonicForWallet,
  validateWalletName,
  decryptWallet,
  walletAdd,
  walletSelect,
} from 'redux/persistWallet/actions'
import {
  FORM_CONFIRM_MNEMONIC,
  FORM_MNEMONIC_LOGIN_PAGE,
  FORM_PRIVATE_KEY_LOGIN_PAGE,
  FORM_LOGIN_PAGE,
} from 'pages'
import { stopSubmit } from 'redux-form'
import { push } from 'react-router-redux'
import mnemonicProvider from '@chronobank/login/network/mnemonicProvider'
import { ethereumProvider } from '../../network/EthereumProvider'
import { btcProvider, ltcProvider, btgProvider } from '../../network/BitcoinProvider'
import { nemProvider } from '../../network/NemProvider'
import bip39 from 'bip39'
import networkService from "../../network/NetworkService";
import privateKeyProvider from "../../network/privateKeyProvider";
import { login } from 'redux/session/actions'
import Web3 from "web3";
import Accounts from "web3-eth-accounts";

export const DUCK_NETWORK = 'network'

export const NETWORK_LOADING = 'network/LOADING'
export const NETWORK_SET_ACCOUNTS = 'network/SET_ACCOUNTS'
export const NETWORK_SELECT_ACCOUNT = 'network/SELECT_ACCOUNT'
export const NETWORK_ADD_ERROR = 'network/ADD_ERROR'
export const NETWORK_CLEAR_ERRORS = 'network/CLEAR_ERRORS'
export const NETWORK_SET_TEST_RPC = 'network/SET_TEST_RPC'
export const NETWORK_SET_TEST_METAMASK = 'network/SET_TEST_METAMASK'
export const NETWORK_SET_NETWORK = 'network/SET_NETWORK'
export const NETWORK_SET_PROVIDER = 'network/SET_PROVIDER'
export const NETWORK_SET_NEW_ACCOUNT_CREDENTIALS = 'network/SET_NEW_ACCOUNT_CREDENTIALS'
export const NETWORK_SET_NEW_MNEMONIC = 'network/SET_NEW_MNEMONIC'

export const NETWORK_SET_IMPORT_MNEMONIC = 'network/SET_IMPORT_MNEMONIC'
export const NETWORK_SET_IMPORT_PRIVATE_KEY = 'network/SET_NEW_PRIVATE_KEY'
export const NETWORK_RESET_IMPORT_PRIVATE_KEY = 'network/RESET_NEW_PRIVATE_KEY'
export const NETWORK_SET_IMPORT_ACCOUNT_MODE = 'network/SET_IMPORT_ACCOUNT_MODE'
export const NETWORK_RESET_IMPORT_ACCOUNT_MODE = 'network/RESET_IMPORT_ACCOUNT_MODE'

export const WALLETS_ADD = 'network/WALLETS_ADD'
export const WALLETS_SELECT = 'network/WALLETS_SELECT'
export const WALLETS_LOAD = 'network/WALLETS_LOAD'
export const WALLETS_UPDATE_LIST = 'network/WALLETS_UPDATE_LIST'
export const WALLETS_REMOVE = 'network/WALLETS_REMOVE'

export const loading = (isLoading = true) => (dispatch) => {
  dispatch({ type: NETWORK_LOADING, isLoading })
}

export const addError = (error) => (dispatch) => {
  dispatch({ type: NETWORK_ADD_ERROR, error })
}

export const clearErrors = () => (dispatch) => {
  dispatch({ type: NETWORK_CLEAR_ERRORS })
}

export const navigateToCreateAccount = () => (dispatch) => {
  dispatch(push('/create-account'))
}

export const navigateToConfirmMnemonicPage = () => (dispatch) => {
  dispatch(push('/confirm-mnemonic'))
}

export const initConfirmMnemonicPage = () => (dispatch, getState) => {
  const state = getState()

  const { newAccountMnemonic } = state.get('network')

  if (!newAccountMnemonic){
    dispatch(navigateToCreateAccount())
  }

}

export const initMnemonicPage = () => (dispatch, getState) => {
  const state = getState()

  const { newAccountName, newAccountPassword } = state.get('network')

  const emptyAccountCredentials = !newAccountName || !newAccountPassword

  if (emptyAccountCredentials){
    dispatch(navigateToCreateAccount())
  }
}

export const initLoginPage = () => (dispatch, getState) => {
  const state = getState()

  const { selectedWallet } = state.get('persistWallet')

  if (!selectedWallet){
    dispatch(navigateToSelectWallet())
  }

}

export const generateNewMnemonic = () => (dispatch) => {
  const mnemonic = mnemonicProvider.generateMnemonic()

  dispatch({ type: NETWORK_SET_NEW_MNEMONIC, mnemonic })
}

// export const setNewImportPrivateKey = (privateKey) => (dispatch) => {
//   dispatch({ type: NETWORK_SET_NEW_PRIVATE_KEY, privateKey })
// }

export const onSubmitCreateAccountPage = (walletName, walletPassword) => async (dispatch, getState) => {
  const state = getState()

  const { importAccountMode, newAccountMnemonic, newAccountPrivateKey } = state.get('network')

  dispatch({ type: NETWORK_SET_NEW_ACCOUNT_CREDENTIALS,  walletName, walletPassword })

  if (importAccountMode){
    console.log('import account mode', arguments, importAccountMode, newAccountMnemonic)

    let wallet = await dispatch(createWallet({
      name: walletName,
      password: walletPassword,
      mnemonic: newAccountMnemonic,
      privateKey: newAccountPrivateKey,
      numberOfAccounts: 0,
    }))

    console.log('wallet', wallet)

    dispatch(walletAdd(wallet))

    dispatch(walletSelect(wallet))

    dispatch(navigateToLoginPage())

    return
  }

  dispatch(generateNewMnemonic())

  dispatch(push('/mnemonic'))

}

export const initImportMethodsPage = () => (dispatch) => {
  dispatch({ type: NETWORK_SET_IMPORT_ACCOUNT_MODE })
}

export const onSubmitConfirmMnemonic = (confirmMnemonic) => (dispatch, getState) => {
  const state = getState()

  const { newAccountMnemonic } = state.get('network')

  if (confirmMnemonic !== newAccountMnemonic){
    // throw new Error('Please enter correct mnemonic phrase')
  }

}

export const onSubmitConfirmMnemonicSuccess = () => async (dispatch, getState) => {
  const state = getState()

  const { newAccountMnemonic, newAccountName, newAccountPassword } = state.get('network')

  console.log('onSubmit confirm success')

  let wallet = await dispatch(createWallet({
    name: newAccountName,
    password: newAccountPassword,
    mnemonic: newAccountMnemonic,
    numberOfAccounts: 0,
  }))

  console.log('onsubmit wallet', wallet.encrypted)

  dispatch(walletAdd(wallet))

  dispatch(walletSelect(wallet))

  dispatch(navigateToLoginPage())
}

export const onSubmitConfirmMnemonicFail = () => (dispatch) => {
  console.log('onSubmit confirm success')

  dispatch(stopSubmit(FORM_CONFIRM_MNEMONIC, { key: 'Wrong confirm phrase' }))
}

export const navigateToSelectImportMethod = () => (dispatch) => {
  dispatch(push('/import-methods'))
}

export const navigateToMnemonicImportMethod = () => (dispatch) => {
  dispatch(push('/mnemonic-login'))
}

export const navigateToPrivateKeyImportMethod = () => (dispatch) => {
  dispatch(push('/private-key-login'))
}

export const navigateToSelectWallet = () => (dispatch) => {
  dispatch(push('/select-wallet'))
}

export const navigateToLoginPage = () => (dispatch) => {
  dispatch(push('/'))
}

export const onSubmitMnemonicLoginForm = (mnemonic) => async (dispatch) => {
  if (!bip39.validateMnemonic(mnemonic)){
    throw new Error('Invalid mnemonic')
  }

  dispatch({ type: NETWORK_SET_NEW_MNEMONIC, mnemonic })

}

export const onSubmitMnemonicLoginFormSuccess = () => (dispatch) => {
  dispatch(navigateToCreateAccount())
}

export const onSubmitMnemonicLoginFormFail = () => (dispatch) => {
  dispatch(stopSubmit(FORM_MNEMONIC_LOGIN_PAGE, { key: 'Wrong mnemonic' }))

}

export const onSubmitPrivateKeyLoginForm = (privateKey) => (dispatch) => {
  dispatch({ type: NETWORK_SET_IMPORT_PRIVATE_KEY, privateKey })
}

export const onSubmitPrivateKeyLoginFormSuccess = () => (dispatch) => {
  dispatch(navigateToCreateAccount())
}

export const onSubmitPrivateKeyLoginFormFail = () => (dispatch) => {
  dispatch(stopSubmit(FORM_PRIVATE_KEY_LOGIN_PAGE, { key: 'Wrong private key' }))

}

export const onSubmitLoginForm = (password) => async (dispatch, getState) => {
  const state = getState()

  const { selectedWallet } = state.get('persistWallet')
  let wallet = await dispatch(decryptWallet(selectedWallet, password))

  console.log('wallet', wallet)

  let privateKey = wallet && wallet[0] && wallet[0].privateKey

  if (privateKey){
    console.log('pk', privateKey)
    await dispatch(handleMnemonicLogin(privateKey))
  }

}

export const onSubmitLoginFormSuccess = () => (dispatch) => {
  // dispatch(push('/wallets'))
}

export const onSubmitLoginFormFail = () => (dispatch) => {
  dispatch(stopSubmit(FORM_LOGIN_PAGE, { key: 'Wrong password' }))

}

export const onWalletSelect = (wallet) => (dispatch) => {
  dispatch(walletSelect(wallet))

  dispatch(navigateToLoginPage())
}

export const handlePrivateKeyLogin = (privateKey) => async (dispatch, getState) => {
  const web3 = new Web3()
  const accounts = new Accounts(new web3.providers.HttpProvider(networkService.getProviderSettings().url))
  await accounts.wallet.clear()

  dispatch(loading())
  dispatch(clearErrors())
  const provider = privateKeyProvider.getPrivateKeyProvider(privateKey.slice(2), networkService.getProviderSettings(), state.get('multisigWallet'))

  networkService.selectAccount(provider.ethereum.getAddress())
  await networkService.setup(provider)

  const state = getState()
  const { selectedAccount, selectedProviderId, selectedNetworkId } = state.get(DUCK_NETWORK)
  console.log('handle', privateKey, selectedAccount, selectedProviderId, selectedNetworkId)

  dispatch(clearErrors())

  const isPassed = await networkService.checkNetwork(
    selectedAccount,
    selectedProviderId,
    selectedNetworkId,
  )

  console.log('isPassed', isPassed)
  if (isPassed) {
    networkService.createNetworkSession(
      selectedAccount,
      selectedProviderId,
      selectedNetworkId,
    )
    dispatch(login(selectedAccount))
  }

}

export const handleMnemonicLogin = () => async (dispatch, getState) => {
  const web3 = new Web3()
  const accounts = new Accounts(new web3.providers.HttpProvider(networkService.getProviderSettings().url))
  await accounts.wallet.clear()

  let mnemonic = 'club bullet chief lend subway small merit engine harbor post scale market'
  dispatch(loading())
  dispatch(clearErrors())
  const provider = mnemonicProvider.getMnemonicProvider(mnemonic, networkService.getProviderSettings())
  networkService.selectAccount(provider.ethereum.getAddress())
  await networkService.setup(provider)

  const state = getState()

  const { selectedAccount, selectedProviderId, selectedNetworkId } = state.get(DUCK_NETWORK)
  console.log('handle', mnemonic, selectedAccount, selectedProviderId, selectedNetworkId, provider.ethereum.getAddress(), networkService.getProviderSettings())

  dispatch(clearErrors())

  const isPassed = await networkService.checkNetwork(
    selectedAccount,
    selectedProviderId,
    selectedNetworkId,
  )

  console.log('isPassed', isPassed)
  if (isPassed) {
    networkService.createNetworkSession(
      selectedAccount,
      selectedProviderId,
      selectedNetworkId,
    )
    dispatch(login(selectedAccount))
  }

}

export const getPrivateKeyFromBlockchain = (blockchain: string) => {
  switch (blockchain) {
    case 'Ethereum':
      return ethereumProvider.getPrivateKey()
    case 'Bitcoin':
      return btcProvider.getPrivateKey()
    case 'Bitcoin Gold':
      return btgProvider.getPrivateKey()
    case 'Litecoin':
      return ltcProvider.getPrivateKey()
    case 'NEM':
      return nemProvider.getPrivateKey()
    default:
      return null
  }
}
