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
  FORM_CREATE_ACCOUNT,
  FORM_RECOVER_ACCOUNT,
  FORM_RESET_PASSWORD,
} from 'pages'
import Web3 from 'web3'
import bip39 from 'bip39'
import Accounts from 'web3-eth-accounts'
import { login } from 'redux/session/actions'
import { stopSubmit, SubmissionError } from 'redux-form'
import { push } from 'react-router-redux'
import mnemonicProvider from '@chronobank/login/network/mnemonicProvider'
import { ethereumProvider } from '../../network/EthereumProvider'
import { btcProvider, ltcProvider, btgProvider } from '../../network/BitcoinProvider'
import { nemProvider } from '../../network/NemProvider'
import networkService from '../../network/NetworkService'
import privateKeyProvider from '../../network/privateKeyProvider'

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
export const NETWORK_RESET_NEW_MNEMONIC = 'network/RESET_NEW_MNEMONIC'

export const NETWORK_SET_IMPORT_MNEMONIC = 'network/SET_IMPORT_MNEMONIC'
export const NETWORK_SET_IMPORT_PRIVATE_KEY = 'network/SET_NEW_PRIVATE_KEY'
export const NETWORK_RESET_IMPORT_PRIVATE_KEY = 'network/RESET_NEW_PRIVATE_KEY'
export const NETWORK_SET_IMPORT_ACCOUNT_MODE = 'network/SET_IMPORT_ACCOUNT_MODE'
export const NETWORK_RESET_IMPORT_ACCOUNT_MODE = 'network/RESET_IMPORT_ACCOUNT_MODE'
export const NETWORK_SET_LOGIN_SUBMITTING = 'network/SET_LOGIN_SUBMITTING'
export const NETWORK_RESET_LOGIN_SUBMITTING = 'network/RESET_LOGIN_SUBMITTING'
export const NETWORK_SET_ACCOUNT_RECOVERY_MODE = 'network/SET_ACCOUNT_RECOVERY_MODE'
export const NETWORK_RESET_ACCOUNT_RECOVERY_MODE = 'network/RESET_ACCOUNT_RECOVERY_MODE'

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

export const navigateToCreateAccountWithoutImport = () => (dispatch) => {
  dispatch(navigateToCreateAccount())
  dispatch({ type: NETWORK_RESET_IMPORT_ACCOUNT_MODE })
}

export const navigateToConfirmMnemonicPage = () => (dispatch) => {
  dispatch(push('/confirm-mnemonic'))
}

export const navigateToDownloadWalletPage = () => (dispatch) => {
  dispatch(push('/download-wallet'))
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

  dispatch({ type: NETWORK_RESET_LOGIN_SUBMITTING })

  if (!selectedWallet){
    dispatch(navigateToSelectWallet())
  }

}

export const resetNewMnemonic = () => (dispatch) => {
  dispatch({ type: NETWORK_RESET_NEW_MNEMONIC })
}
export const generateNewMnemonic = () => (dispatch) => {
  const mnemonic = mnemonicProvider.generateMnemonic()

  dispatch({ type: NETWORK_SET_NEW_MNEMONIC, mnemonic })
}

// export const setNewImportPrivateKey = (privateKey) => (dispatch) => {
//   dispatch({ type: NETWORK_SET_NEW_PRIVATE_KEY, privateKey })
// }

export const resetImportAccountMode = () => (dispatch) => {
  dispatch({ type: NETWORK_RESET_IMPORT_ACCOUNT_MODE })
}

export const onSubmitCreateAccountPage = (walletName, walletPassword) => async (dispatch, getState) => {
  const state = getState()

  const { importAccountMode, newAccountMnemonic, newAccountPrivateKey } = state.get('network')

  const validateName = dispatch(validateWalletName(walletName))

  if (!validateName){
    throw new SubmissionError({ walletName: 'Wrong wallet name' })
  }

  dispatch({ type: NETWORK_SET_NEW_ACCOUNT_CREDENTIALS,  walletName, walletPassword })

  if (importAccountMode){
    let wallet = await dispatch(createWallet({
      name: walletName,
      password: walletPassword,
      mnemonic: newAccountMnemonic,
      privateKey: newAccountPrivateKey,
      numberOfAccounts: 0,
    }))

    dispatch(walletAdd(wallet))

    dispatch(walletSelect(wallet))

    dispatch(resetImportAccountMode())

    dispatch(navigateToLoginPage())

    return
  }

  dispatch(generateNewMnemonic())

  dispatch(push('/mnemonic'))

}

export const onSubmitCreateAccountPageSuccess = () => (dispatch) => {

}

export const onSubmitCreateAccountPageFail = (errors, dispatch, submitErrors) => (dispatch) => {
  dispatch(stopSubmit(FORM_CREATE_ACCOUNT, submitErrors && submitErrors.errors))
}

export const initImportMethodsPage = () => (dispatch) => {
  dispatch({ type: NETWORK_SET_IMPORT_ACCOUNT_MODE })
}

export const onSubmitConfirmMnemonic = (confirmMnemonic) => (dispatch, getState) => {
  const state = getState()

  const { newAccountMnemonic } = state.get('network')

  if (confirmMnemonic !== newAccountMnemonic){
    throw new SubmissionError({ _error: 'Please enter correct mnemonic phrase'  })
  }

}

export const onSubmitConfirmMnemonicSuccess = () => async (dispatch, getState) => {
  const state = getState()

  const { newAccountMnemonic, newAccountName, newAccountPassword } = state.get('network')

  let wallet = await dispatch(createWallet({
    name: newAccountName,
    password: newAccountPassword,
    mnemonic: newAccountMnemonic,
    numberOfAccounts: 0,
  }))

  dispatch(walletAdd(wallet))

  dispatch(walletSelect(wallet))

  dispatch(navigateToDownloadWalletPage())
}

export const onSubmitConfirmMnemonicFail = (errors, dispatch, submitErrors) => (dispatch) => {
  dispatch(stopSubmit(FORM_CONFIRM_MNEMONIC, submitErrors && submitErrors.errors))
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

export const navigateToResetPasswordPage = () => (dispatch) => {
  dispatch(push('/reset-password'))
}

export const navigateToRecoverAccountPage = () => (dispatch) => {
  dispatch(push('/recover-account'))
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
  let pk = privateKey || ''

  if (pk.slice(0, 2) === '0x'){
    pk = pk.slice(2)
  }

  dispatch({ type: NETWORK_SET_IMPORT_PRIVATE_KEY, privateKey: pk })
}

export const onSubmitPrivateKeyLoginFormSuccess = () => (dispatch) => {
  dispatch(navigateToCreateAccount())
}

export const onSubmitPrivateKeyLoginFormFail = () => (dispatch) => {
  dispatch(stopSubmit(FORM_PRIVATE_KEY_LOGIN_PAGE, { pk: 'Wrong private key' }))

}

export const onSubmitLoginForm = (password) => async (dispatch, getState) => {
  const state = getState()

  dispatch({ type: NETWORK_SET_LOGIN_SUBMITTING })

  const { selectedWallet } = state.get('persistWallet')
  let wallet = await dispatch(decryptWallet(selectedWallet, password))

  let privateKey = wallet && wallet[0] && wallet[0].privateKey

  if (privateKey){
    await dispatch(handlePrivateKeyLogin(privateKey))
  }

}

export const onSubmitLoginFormSuccess = () => (dispatch) => {
}

export const onSubmitLoginFormFail = () => (dispatch) => {
  dispatch(stopSubmit(FORM_LOGIN_PAGE, { password: 'Wrong password' }))
  dispatch({ type: NETWORK_RESET_LOGIN_SUBMITTING })

}

export const validateRecoveryForm = (mnemonic) => (dispatch, getState) => {
  const state = getState()

  const { selectedWallet } = state.get('persistWallet')

  return dispatch(validateMnemonicForWallet(selectedWallet, mnemonic))

}

export const initRecoverAccountPage = () => (dispatch) => {
  dispatch(resetNewMnemonic())
  dispatch({ type: NETWORK_SET_ACCOUNT_RECOVERY_MODE })
}

export const onSubmitRecoverAccountForm = (mnemonic) => (dispatch) => {
  const validForm = dispatch(validateRecoveryForm(mnemonic))

  if (!validForm) {
    throw new SubmissionError({ _error: 'Mnemonic incorrect for this wallet' })
  }

  dispatch({ type: NETWORK_SET_NEW_MNEMONIC, mnemonic })
}

export const onSubmitRecoverAccountFormSuccess = () => (dispatch) => {
  dispatch(navigateToResetPasswordPage())
}

export const onSubmitRecoverAccountFormFail = () => (dispatch) => {
  dispatch(stopSubmit(FORM_RECOVER_ACCOUNT, { pk: 'Wrong private key' }))

}

export const initResetPasswordPage = () => (dispatch, getState) => {
  const state = getState()

  const { accountRecoveryMode } = state.get('network')

  if (!accountRecoveryMode){
    dispatch(navigateToRecoverAccountPage())
  }
}

export const onSubmitResetAccountPasswordForm = (password) => async (dispatch, getState) => {
  const state = getState()

  const { newAccountMnemonic } = state.get('network')
  const { selectedWallet } = state.get('persistWallet')

  await dispatch(resetPasswordWallet(selectedWallet, newAccountMnemonic, password))

}

export const onSubmitResetAccountPasswordSuccess = () => (dispatch) => {
  dispatch({ type: NETWORK_RESET_ACCOUNT_RECOVERY_MODE })
  dispatch(navigateToLoginPage())

}

export const onSubmitResetAccountPasswordFail = (error, dispatch, submitError) => (dispatch) => {
  console.log('onSubmitReset', submitError)
  dispatch(stopSubmit(FORM_RESET_PASSWORD, { _error: 'Error' }))

}

export const onWalletSelect = (wallet) => (dispatch) => {
  dispatch(walletSelect(wallet))

  dispatch(navigateToLoginPage())
}

export const handlePrivateKeyLogin = (privateKey) => async (dispatch, getState) => {
  let state = getState()

  dispatch(loading())
  dispatch(clearErrors())
  const provider = privateKeyProvider.getPrivateKeyProvider(privateKey.slice(2), networkService.getProviderSettings(), state.get('multisigWallet'))

  networkService.selectAccount(provider.ethereum.getAddress())
  await networkService.setup(provider)

  state = getState()
  const { selectedAccount, selectedProviderId, selectedNetworkId } = state.get(DUCK_NETWORK)

  dispatch(clearErrors())

  const isPassed = await networkService.checkNetwork(
    selectedAccount,
    selectedProviderId,
    selectedNetworkId,
  )

  if (isPassed) {
    networkService.createNetworkSession(
      selectedAccount,
      selectedProviderId,
      selectedNetworkId,
    )
    dispatch(login(selectedAccount))
  }

}

export const handleMnemonicLogin = (mnemonic) => async (dispatch, getState) => {
  const web3 = new Web3()
  const accounts = new Accounts(new web3.providers.HttpProvider(networkService.getProviderSettings().url))
  await accounts.wallet.clear()

  dispatch(loading())
  dispatch(clearErrors())
  const provider = mnemonicProvider.getMnemonicProvider(mnemonic, networkService.getProviderSettings())
  networkService.selectAccount(provider.ethereum.getAddress())
  await networkService.setup(provider)

  const state = getState()

  const { selectedAccount, selectedProviderId, selectedNetworkId } = state.get(DUCK_NETWORK)

  dispatch(clearErrors())

  const isPassed = await networkService.checkNetwork(
    selectedAccount,
    selectedProviderId,
    selectedNetworkId,
  )

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
