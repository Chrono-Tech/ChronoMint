/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import {
  createAccount,
  resetPasswordAccount,
  validateMnemonicForAccount,
  validateAccountName,
  decryptAccount,
  accountAdd,
  accountSelect,
  accountUpdate,
  setProfilesForAccounts,
  customNetworkCreate,
  customNetworkEdit,
  customNetworksDelete,
  DUCK_PERSIST_ACCOUNT,
} from '@chronobank/core/redux/persistAccount/actions'
import Web3Legacy from 'web3legacy'
import PublicBackendProvider from '@chronobank/login/network/PublicBackendProvider'
import uuid from 'uuid/v1'
import Web3 from 'web3'
import axios from 'axios'
import bip39 from 'bip39'
import Accounts from 'web3-eth-accounts'
import { login } from '@chronobank/core/redux/session/actions'
import { stopSubmit, SubmissionError, change } from 'redux-form'
import { AccountEntryModel } from '@chronobank/core/models/wallet/persistAccount'
import { push, goBack } from '@chronobank/core-dependencies/router'
import networkService from '../../network/NetworkService'
import profileService from '../../network/ProfileService'
import privateKeyProvider from '../../network/privateKeyProvider'
import mnemonicProvider from '../../network/mnemonicProvider'
import { ethereumProvider } from '../../network/EthereumProvider'
import { btcProvider, ltcProvider, btgProvider } from '../../network/BitcoinProvider'
import { nemProvider } from '../../network/NemProvider'
import {
  LOCAL_PRIVATE_KEYS,
  isLocalNode,
} from '../../network/settings'

export const DUCK_NETWORK = 'network'

export const NETWORK_LOADING = 'network/LOADING'
export const NETWORK_SET_ACCOUNTS = 'network/SET_ACCOUNTS'
export const NETWORK_SELECT_ACCOUNT = 'network/SELECT_ACCOUNT'
export const NETWORK_ADD_ERROR = 'network/ADD_ERROR'
export const NETWORK_CLEAR_ERRORS = 'network/CLEAR_ERRORS'
export const NETWORK_SET_TEST_MNEMONIC = 'network/SET_TEST_MNEMONIC'
export const NETWORK_SET_TEST_WALLET_FILE = 'network/SET_TEST_WALLET_FILE'
export const NETWORK_SET_TEST_RPC = 'network/SET_TEST_RPC'
export const NETWORK_SET_TEST_METAMASK = 'network/SET_TEST_METAMASK'
export const NETWORK_SET_NETWORK = 'network/SET_NETWORK'
export const NETWORK_SET_PROVIDER = 'network/SET_PROVIDER'
export const NETWORK_SET_NEW_ACCOUNT_CREDENTIALS = 'network/SET_NEW_ACCOUNT_CREDENTIALS'
export const NETWORK_RESET_NEW_ACCOUNT_CREDENTIALS = 'network/RESET_NEW_ACCOUNT_CREDENTIALS'
export const NETWORK_SET_NEW_MNEMONIC = 'network/SET_NEW_MNEMONIC'
export const NETWORK_RESET_NEW_MNEMONIC = 'network/RESET_NEW_MNEMONIC'

export const NETWORK_SET_IMPORT_MNEMONIC = 'network/SET_IMPORT_MNEMONIC'
export const NETWORK_SET_IMPORT_PRIVATE_KEY = 'network/SET_NEW_PRIVATE_KEY'
export const NETWORK_RESET_IMPORT_PRIVATE_KEY = 'network/RESET_NEW_PRIVATE_KEY'
export const NETWORK_SET_IMPORT_WALLET_FILE = 'network/SET_IMPORT_WALLET_FILE'
export const NETWORK_RESET_IMPORT_WALLET_FILE = 'network/RESET_IMPORT_WALLET_FILE'
export const NETWORK_SET_IMPORT_ACCOUNT_MODE = 'network/SET_IMPORT_ACCOUNT_MODE'
export const NETWORK_RESET_IMPORT_ACCOUNT_MODE = 'network/RESET_IMPORT_ACCOUNT_MODE'
export const NETWORK_SET_LOGIN_SUBMITTING = 'network/SET_LOGIN_SUBMITTING'
export const NETWORK_RESET_LOGIN_SUBMITTING = 'network/RESET_LOGIN_SUBMITTING'
export const NETWORK_SET_ACCOUNT_RECOVERY_MODE = 'network/SET_ACCOUNT_RECOVERY_MODE'
export const NETWORK_RESET_ACCOUNT_RECOVERY_MODE = 'network/RESET_ACCOUNT_RECOVERY_MODE'
export const NETWORK_SET_PROFILE_SIGNATURE = 'network/SET_PROFILE_SIGNATURE'

export const NETWORK_ACCOUNTS_SIGNATURES_LOADING = 'network/ACCOUNTS_SIGNATURES_LOADING'
export const NETWORK_ACCOUNTS_SIGNATURES_RESET_LOADING = 'network/ACCOUNTS_SIGNATURES_RESET_LOADING'
export const NETWORK_ACCOUNTS_SIGNATURES_RESOLVE = 'network/ACCOUNTS_SIGNATURES_RESOLVE'
export const NETWORK_ACCOUNTS_SIGNATURES_REJECT = 'network/ACCOUNTS_SIGNATURES_REJECT'
export const NETWORK_SET_WALLET_FILE_IMPORTED = 'network/SET_WALLET_FILE_IMPORTED'
export const NETWORK_RESET_WALLET_FILE_IMPORTED = 'network/RESET_WALLET_FILE_IMPORTED'

export const FORM_CONFIRM_MNEMONIC = 'ConfirmMnemonicForm'
export const FORM_MNEMONIC_LOGIN_PAGE = 'FormMnemonicLoginPage'
export const FORM_PRIVATE_KEY_LOGIN_PAGE = 'FormPrivateKeyLoginPage'
export const FORM_LOGIN_PAGE = 'FormLoginPage'
export const FORM_CREATE_ACCOUNT = 'CreateAccountForm'
export const FORM_RECOVER_ACCOUNT = 'RecoverAccountPage'
export const FORM_RESET_PASSWORD = 'ResetPasswordPage'
export const FORM_WALLET_UPLOAD = 'FormWalletUploadPage'

export const FORM_NETWORK_CREATE = 'FormNetworkCreate'
export const FORM_NETWORK_CONFIRM_DELETE = 'FormNetworkConfirmDelete'
export const FORM_FOOTER_EMAIL_SUBSCRIPTION = 'FooterEmailSubscriptionForm'
export const FORM_LOGIN_PAGE_FIELD_SUCCESS_MESSAGE = 'LoginPageFieldSuccessMessage'

export const loading = (isLoading = true) => (dispatch) => {
  dispatch({ type: NETWORK_LOADING, isLoading })
}

export const addError = (error) => (dispatch) => {
  dispatch({ type: NETWORK_ADD_ERROR, error })
}

export const clearErrors = () => (dispatch) => {
  dispatch({ type: NETWORK_CLEAR_ERRORS })
}

export const navigateToCreateAccountWithoutImport = () => (dispatch) => {
  dispatch(navigateToCreateAccount())
  dispatch({ type: NETWORK_RESET_IMPORT_ACCOUNT_MODE })
}

export const navigateToCreateAccountFromHW = (address) => (dispatch) => {
  dispatch({ type: NETWORK_SET_ACCOUNTS, address: address })
  dispatch(navigateToCreateHWAccount())
}

export const initConfirmMnemonicPage = () => (dispatch, getState) => {
  const state = getState()

  const { newAccountMnemonic } = state.get(DUCK_NETWORK)

  if (!newAccountMnemonic) {
    dispatch(navigateToCreateAccount())
  }

}

export const initMnemonicPage = () => (dispatch, getState) => {
  const state = getState()

  const { newAccountName, newAccountPassword } = state.get(DUCK_NETWORK)

  const emptyAccountCredentials = !newAccountName || !newAccountPassword

  if (emptyAccountCredentials) {
    dispatch(navigateToCreateAccount())
  }
}

export const resetAllLoginFlags = () => (dispatch) => {
  dispatch({ type: NETWORK_RESET_IMPORT_PRIVATE_KEY })
  dispatch({ type: NETWORK_RESET_IMPORT_WALLET_FILE })
  dispatch({ type: NETWORK_RESET_IMPORT_ACCOUNT_MODE })
  dispatch({ type: NETWORK_RESET_ACCOUNT_RECOVERY_MODE })
  dispatch({ type: NETWORK_RESET_NEW_MNEMONIC })
  dispatch({ type: NETWORK_RESET_NEW_ACCOUNT_CREDENTIALS })
  dispatch({ type: NETWORK_RESET_WALLET_FILE_IMPORTED })
}

export const initLoginPage = () => async (dispatch, getState) => {
  dispatch(resetAllLoginFlags())

  const state = getState()

  const { selectedWallet, walletsList } = state.get(DUCK_PERSIST_ACCOUNT)

  dispatch({ type: NETWORK_RESET_LOGIN_SUBMITTING })

  dispatch(initAccountsSignature())

  if (walletsList && !walletsList.length) {
    dispatch(navigateToCreateAccount())
  }

  if (!selectedWallet) {
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

export const resetImportAccountMode = () => (dispatch) => {
  dispatch({ type: NETWORK_RESET_IMPORT_ACCOUNT_MODE })
}

export const onSubmitCreateHWAccountPage = (walletName) => async (dispatch, getState) => {
  const state = getState()

  const { importAccountMode, newAccountMnemonic, newAccountPrivateKey, walletFileImportMode } = state.get('network')
  const { walletsList } = state.get('persistAccount')

  const validateName = dispatch(validateAccountName(walletName))

  if (!validateName) {
    throw new SubmissionError({ walletName: 'Wrong wallet name' })
  }

  dispatch({ type: NETWORK_SET_NEW_ACCOUNT_CREDENTIALS, walletName, walletName })

  if (importAccountMode) {
    try {
      let wallet = await dispatch(createHWAccount({
        name: walletName,
        pupblicKey: newAccountPrivateKey,
        numberOfAccounts: 0,
      }))

      dispatch(accountAdd(wallet))

      dispatch(accountSelect(wallet))

      dispatch(resetImportAccountMode())

    } catch (e) {
      throw new SubmissionError({ _error: e && e.message })
    }

    return
  }
}

export const onSubmitCreateAccountPage = (walletName, walletPassword) => async (dispatch, getState) => {
  const state = getState()

  const { importAccountMode, newAccountMnemonic, newAccountPrivateKey, walletFileImportMode } = state.get(DUCK_NETWORK)
  // TODO @abdulov remove console.log
  console.log('importAccountMode, newAccountMnemonic, newAccountPrivateKey, walletFileImportMode', importAccountMode, newAccountMnemonic, newAccountPrivateKey, walletFileImportMode)

  const validateName = dispatch(validateAccountName(walletName))

  if (!validateName) {
    throw new SubmissionError({ walletName: 'Wrong wallet name' })
  }

  dispatch({ type: NETWORK_SET_NEW_ACCOUNT_CREDENTIALS, walletName, walletPassword })

  if (importAccountMode) {
    try {
      let wallet = await dispatch(createAccount({
        name: walletName,
        password: walletPassword,
        mnemonic: newAccountMnemonic,
        privateKey: newAccountPrivateKey,
        numberOfAccounts: 0,
      }))

      dispatch(accountAdd(wallet))

      dispatch(accountSelect(wallet))

      dispatch(resetImportAccountMode())

      if (walletFileImportMode) {
        dispatch(navigateToSelectWallet())
      } else {
        dispatch(navigateToDownloadWalletPage())
      }
    } catch (e) {
      throw new SubmissionError({ _error: e && e.message })
    }

    return
  }

  dispatch(generateNewMnemonic())

  dispatch(navigateToGenerateMnemonicPage())
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

  const { newAccountMnemonic } = state.get(DUCK_NETWORK)

  if (confirmMnemonic !== newAccountMnemonic) {
    throw new SubmissionError({ _error: 'Please enter correct mnemonic phrase' })
  }

}

export const onSubmitConfirmMnemonicSuccess = () => async (dispatch, getState) => {
  const state = getState()

  const { newAccountMnemonic, newAccountName, newAccountPassword } = state.get(DUCK_NETWORK)

  let wallet = await dispatch(createAccount({
    name: newAccountName,
    password: newAccountPassword,
    mnemonic: newAccountMnemonic,
    numberOfAccounts: 0,
  }))

  dispatch(accountAdd(wallet))

  dispatch(accountSelect(wallet))

  dispatch(navigateToDownloadWalletPage())
}

export const onSubmitConfirmMnemonicFail = (errors, dispatch, submitErrors) => (dispatch) => {
  dispatch(stopSubmit(FORM_CONFIRM_MNEMONIC, submitErrors && submitErrors.errors))
}

export const navigateToConfirmMnemonicPage = () => (dispatch) => {
  dispatch(push('/login/confirm-mnemonic'))
}

export const navigateToDownloadWalletPage = () => (dispatch) => {
  dispatch(push('/login/download-wallet'))
}

export const navigateToCreateAccount = () => (dispatch) => {
  dispatch(push('/login/create-account'))
}

export const navigateToCreateHWAccount = () => (dispatch) => {
  dispatch(push('/login/create-hw-account'))
}


export const navigateToSelectImportMethod = () => (dispatch) => {
  dispatch(push('/login/import-methods'))
}

export const navigateToTrezorImportMethod = () => (dispatch) => {
  dispatch(push('/login/trezor-login'))
}

export const navigateToLedgerImportMethod = () => (dispatch) => {
  dispatch(push('/login/ledger-login'))
}

export const navigateToPluginImportMethod = () => (dispatch) => {
  dispatch(push('/login/plugin-login'))
}

export const navigateToMnemonicImportMethod = () => (dispatch) => {
  dispatch(push('/login/mnemonic-login'))
}

export const navigateToPrivateKeyImportMethod = () => (dispatch) => {
  dispatch(push('/login/private-key-login'))
}

export const navigateToSelectWallet = () => (dispatch) => {
  dispatch(push('/login/select-account'))
}

export const navigateToLoginPage = () => (dispatch) => {
  dispatch(push('/login'))
}

export const navigateToResetPasswordPage = () => (dispatch) => {
  dispatch(push('/login/reset-password'))
}

export const navigateToRecoverAccountPage = () => (dispatch) => {
  dispatch(push('/login/recover-account'))
}

export const navigateToGenerateMnemonicPage = () => (dispatch) => {
  dispatch(push('/login/mnemonic'))
}

export const navigateToWalletUploadMethod = () => (dispatch) => {
  dispatch(push('/login/upload-wallet'))
}

export const navigateToAccountName = () => (dispatch) => {
  dispatch(push('/login/account-name'))
}

export const handleLoginTrezorAccountClick = (address) => (dispatch) => {
  console.log(address)
  dispatch(navigateToCreateAccountFromHW(address))
}

export const navigateToLoginLocal = () => (dispatch) => {
  dispatch(push('/login/local-login'))
}

export const navigateBack = () => (dispatch) => {
  dispatch(goBack())
}

export const onSubmitMnemonicLoginForm = (mnemonic) => (dispatch) => {
  let mnemonicValue = (mnemonic || '').trim()

  if (!mnemonicProvider.validateMnemonic(mnemonicValue)) {
    throw new SubmissionError({ mnemonic: 'Invalid mnemonic' })
  }

  dispatch({ type: NETWORK_SET_NEW_MNEMONIC, mnemonic: mnemonicValue })

}

export const onSubmitMnemonicLoginFormSuccess = () => (dispatch) => {
  dispatch(navigateToCreateAccount())
}

export const onSubmitMnemonicLoginFormFail = (errors, dispatch, submitErrors) => (dispatch) => {
  dispatch(stopSubmit(FORM_MNEMONIC_LOGIN_PAGE, submitErrors && submitErrors.errors))

}

export const onSubmitPrivateKeyLoginForm = (privateKey) => (dispatch) => {
  let pk = (privateKey || '').trim()

  if (!privateKeyProvider.validatePrivateKey(privateKey)) {
    throw new SubmissionError({ pk: 'Wrong private key' })
  }

  if (pk.slice(0, 2) === '0x') {
    pk = pk.slice(2)
  }

  dispatch({ type: NETWORK_SET_IMPORT_PRIVATE_KEY, privateKey: pk })
}

export const onSubmitPrivateKeyLoginFormSuccess = () => (dispatch) => {
  dispatch(navigateToCreateAccount())
}

export const onSubmitPrivateKeyLoginFormFail = (errors, dispatch, submitErrors) => (dispatch) => {
  dispatch(stopSubmit(FORM_PRIVATE_KEY_LOGIN_PAGE, submitErrors && submitErrors.errors))

}

export const setProfileSignature = (signature) => (dispatch) => {
  dispatch({ type: NETWORK_SET_PROFILE_SIGNATURE, signature })
}

export const getProfileSignature = (wallet) => async (dispatch) => {
  if (!wallet) {
    return
  }

  let signDataString = profileService.getSignData()

  let signData = wallet.sign(signDataString)

  let profileSignature = await profileService.getProfile(signData.signature)

  dispatch(setProfileSignature(profileSignature))

  return profileSignature
}

export const onSubmitLoginForm = (password) => async (dispatch, getState) => {
  const state = getState()

  dispatch({ type: NETWORK_SET_LOGIN_SUBMITTING })

  const { selectedWallet } = state.get(DUCK_PERSIST_ACCOUNT)

  try {
    let wallet = await dispatch (decryptAccount(selectedWallet.encrypted, password))

    let privateKey = wallet && wallet[0] && wallet[0].privateKey

    dispatch(getProfileSignature(wallet[0]))

    if (privateKey) {
      await dispatch(handlePrivateKeyLogin(privateKey))
    }

  } catch (e) {
    throw new SubmissionError({ password: e && e.message })
  }
}

export const onSubmitLoginFormSuccess = () => () => {
}

export const onSubmitLoginFormFail = (errors, dispatch, submitErrors) => (dispatch) => {
  dispatch(stopSubmit(FORM_LOGIN_PAGE, submitErrors && submitErrors.errors))
  dispatch({ type: NETWORK_RESET_LOGIN_SUBMITTING })

}

export const validateRecoveryForm = (mnemonic) => async (dispatch, getState) => {
  const state = getState()

  const { selectedWallet } = state.get(DUCK_PERSIST_ACCOUNT)

  const validateMnemonic = await dispatch(validateMnemonicForAccount(selectedWallet, mnemonic))

  return validateMnemonic
}

export const initRecoverAccountPage = () => (dispatch) => {
  dispatch(resetNewMnemonic())
  dispatch({ type: NETWORK_SET_ACCOUNT_RECOVERY_MODE })
}

export const onSubmitRecoverAccountForm = (mnemonic) => async (dispatch) => {
  const validForm = await dispatch(validateRecoveryForm(mnemonic))

  if (!validForm) {
    throw new SubmissionError({ _error: 'Mnemonic incorrect for this wallet' })
  }

  dispatch({ type: NETWORK_SET_NEW_MNEMONIC, mnemonic })
}

export const onSubmitRecoverAccountFormSuccess = () => (dispatch) => {
  dispatch(navigateToResetPasswordPage())
}

export const onSubmitRecoverAccountFormFail = (errors, dispatch, submitErrors) => (dispatch) => {
  dispatch(stopSubmit(FORM_RECOVER_ACCOUNT, submitErrors && submitErrors.errors))
}

export const initResetPasswordPage = () => (dispatch, getState) => {
  const state = getState()

  const { accountRecoveryMode } = state.get(DUCK_NETWORK)

  if (!accountRecoveryMode) {
    dispatch(navigateToRecoverAccountPage())
  }
}

export const onSubmitResetAccountPasswordForm = (password, confirmPassword) => async (dispatch, getState) => {
  const state = getState()

  const { newAccountMnemonic } = state.get(DUCK_NETWORK)
  const { selectedWallet } = state.get(DUCK_PERSIST_ACCOUNT)

  await dispatch(resetPasswordAccount(selectedWallet, newAccountMnemonic, password))

}

export const onSubmitResetAccountPasswordSuccess = () => (dispatch) => {
  dispatch({ type: NETWORK_RESET_ACCOUNT_RECOVERY_MODE })
  dispatch(navigateToLoginPage())
  dispatch(change(
    FORM_LOGIN_PAGE,
    FORM_LOGIN_PAGE_FIELD_SUCCESS_MESSAGE,
    'Your password has been reset.',
  ))

}

export const onSubmitResetAccountPasswordFail = (error, dispatch, submitError) => (dispatch) => {
  dispatch(stopSubmit(FORM_RESET_PASSWORD, { _error: 'Error' }))

}

export const onSubmitWalletUpload = (walletString, password) => async (dispatch, getState) => {
  const state = getState()

  let restoredWalletJSON

  try {
    restoredWalletJSON = JSON.parse(walletString)

    if ('Crypto' in restoredWalletJSON) {
      restoredWalletJSON.crypto = restoredWalletJSON.Crypto
      delete restoredWalletJSON.Crypto
    }

  } catch (e) {
    throw new SubmissionError({ _error: 'Broken wallet file' })
  }

  if (restoredWalletJSON && restoredWalletJSON.address) {
    let response

    try {
      response = await profileService.getPersonInfo(restoredWalletJSON.address)
    } catch (e) {
    }

    if (response && response.data && response.data.length) {
      const profile = response.data[0]

      const account = new AccountEntryModel({
        key: uuid(),
        name: profile.userName,
        encrypted: [restoredWalletJSON],
        profile,
      })

      dispatch(accountAdd(account))

      dispatch(accountSelect(account))

      dispatch(navigateToLoginPage())

    } else {
      dispatch(setImportedWalletFile(restoredWalletJSON))

      dispatch(navigateToAccountName())

    }
  } else {
    throw new SubmissionError({ _error: 'Wrong wallet address' })
  }

}

export const onSubmitWalletUploadSuccess = () => (dispatch) => {

}

export const onSubmitWalletUploadFail = (error, dispatch, submitError) => (dispatch) => {
  dispatch(stopSubmit(FORM_WALLET_UPLOAD, submitError && submitError.errors))

}

export const onSubmitAccountName = (name) => (dispatch, getState) => {
  const state = getState()

  const { walletFileImportObject } = state.get('network')

  const account = new AccountEntryModel({
    key: uuid(),
    name: name,
    encrypted: [walletFileImportObject],
    profile: null,
  })

  dispatch(accountAdd(account))

  dispatch(accountSelect(account))

}

export const onSubmitAccountNameSuccess = () => (dispatch) => {
  dispatch(navigateToLoginPage())
}

export const onSubmitAccountNameFail = (errors, dispatch, submitErrors) => (dispatch) => {

}

export const initLoginWithWallet = () => (dispatch) => {
  dispatch(setImportWalletFile())
}

export const setImportWalletFile = () => (dispatch) => {
  dispatch({ type: NETWORK_SET_IMPORT_WALLET_FILE })
}

export const onWalletSelect = (wallet) => (dispatch, getState) => {
  let state = getState()

  const { accountRecoveryMode } = state.get(DUCK_NETWORK)

  dispatch(accountSelect(wallet))

  if (accountRecoveryMode) {
    dispatch(navigateToRecoverAccountPage())

    return
  }

  dispatch(navigateToLoginPage())
}

export const handlePrivateKeyLogin = (privateKey) => async (dispatch, getState) => {
  let state = getState()

  dispatch(loading())
  dispatch(clearErrors())
  const provider = privateKeyProvider.getPrivateKeyProvider(
    privateKey.slice(2),
    networkService.getProviderSettings(),
    state.get('multisigWallet'),
  )

  networkService.selectAccount(provider.ethereum.getAddress())
  await networkService.setup(provider)

  state = getState()
  const { selectedAccount, selectedProviderId, selectedNetworkId } = state.get(DUCK_NETWORK)

  dispatch(clearErrors())

  const isPassed = await networkService.checkNetwork()

  if (isPassed) {
    networkService.createNetworkSession(
      selectedAccount,
      selectedProviderId,
      selectedNetworkId,
    )
    dispatch(login(selectedAccount))
  }

}

export const loadingAccountsSignatures = () => (dispatch) => {
  dispatch({ type: NETWORK_ACCOUNTS_SIGNATURES_LOADING })
}

export const resetLoadingAccountsSignatures = () => (dispatch) => {
  dispatch({ type: NETWORK_ACCOUNTS_SIGNATURES_RESET_LOADING })
}

export const updateSelectedAccount = () => (dispatch, getState) => {
  const state = getState()

  const { selectedWallet, walletsList } = state.get(DUCK_PERSIST_ACCOUNT)

  const foundAccount = walletsList.find((account) => account.key === selectedWallet.key)

  if (foundAccount) {
    dispatch(accountSelect(foundAccount))
  }
}

export const initAccountsSignature = () => async (dispatch, getState) => {
  const state = getState()

  const { loadingAccountSignatures } = state.get(DUCK_NETWORK)
  const { walletsList } = state.get(DUCK_PERSIST_ACCOUNT)

  if (loadingAccountSignatures || !walletsList.length) {
    return
  }

  dispatch(loadingAccountsSignatures())

  const accounts = await dispatch(setProfilesForAccounts(walletsList))

  accounts.forEach((account) => dispatch(accountUpdate(account)))

  dispatch(updateSelectedAccount())

  dispatch(resetLoadingAccountsSignatures())

}

export const initAccountNamePage = () => (dispatch) => {

}

export const initAccountsSelector = () => async (dispatch) => {
  dispatch(initAccountsSignature())
}

export const initLoginLocal = () => async (dispatch, getState) => {
  const state = getState()

  const { selectedNetworkId, selectedProviderId } = state.get(DUCK_NETWORK)

  if (isLocalNode(selectedProviderId, selectedNetworkId)) {
    await networkService.loadAccounts()
  } else {
    dispatch(navigateToLoginPage())
  }
}

export const handleLoginLocalAccountClick = (account = '') => async (dispatch, getState) => {
  let state = getState()

  const { accounts } = state.get(DUCK_NETWORK)
  const wallets = state.get('multisigWallet')

  const index = Math.max(accounts.indexOf(account), 0)
  const provider = privateKeyProvider.getPrivateKeyProvider(
    LOCAL_PRIVATE_KEYS[index],
    networkService.getProviderSettings(),
    wallets,
  )
  networkService.selectAccount(account)
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

export const initCommonNetworkSelector = () => (dispatch, getState) => {
  const state = getState()

  const { isLocal } = state.get(DUCK_NETWORK)

  networkService.autoSelect()

  if (!isLocal) {
    networkService.checkTestRPC()
  }

}

export const selectProviderWithNetwork = (networkId, providerId) => (dispatch) => {
  networkService.selectProvider(providerId)
  networkService.selectNetwork(networkId)

  if (isLocalNode(providerId, networkId)) {
    dispatch(navigateToLoginLocal())
  }
}

export const handleSubmitCreateNetwork = (url, alias) => (dispatch) => {
  dispatch(customNetworkCreate(url, alias))
}

export const setImportedWalletFile = (wallet) => (dispatch) => {
  dispatch({ type: NETWORK_SET_WALLET_FILE_IMPORTED, data: wallet })
}

export const handleSubmitEditNetwork = (network) => (dispatch) => {
  dispatch(customNetworkEdit(network))
}

export const handleDeleteNetwork = (network) => (dispatch) => {
  dispatch(customNetworksDelete(network))
}

export const onSubmitSubscribeNewsletter = (email) => async (dispatch) => {
  const publicBackendProvider = new PublicBackendProvider()

  const subscriptionsService = await axios.create({
    baseURL: publicBackendProvider.getPublicHost(),
  })

  try {
    await subscriptionsService.options('/api/v1/subscriptions')

    await subscriptionsService.post('/api/v1/subscriptions', {
      email,
    })
  } catch (e) {
    throw new SubmissionError({ _error: e && e.message })

  }

}

export const onSubmitSubscribeNewsletterFail = (errors, dispatch, submitErrors) => (dispatch) => {
  dispatch(stopSubmit(FORM_FOOTER_EMAIL_SUBSCRIPTION, submitErrors && submitErrors.errors))

}

export const onSubmitSubscribeNewsletterSuccess = () => (dispatch) => {

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
