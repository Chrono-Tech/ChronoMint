/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 *
 * @flow
 */

export const DUCK_NETWORK = 'network'

export const NETWORK_LOADING = '@login/network/LOADING'
export const NETWORK_SET_ACCOUNTS = '@login/network/SET_ACCOUNTS'
export const NETWORK_SELECT_ACCOUNT = '@login/network/SELECT_ACCOUNT'
export const NETWORK_ADD_ERROR = '@login/network/ADD_ERROR'
export const NETWORK_CLEAR_ERRORS = '@login/network/CLEAR_ERRORS'
export const NETWORK_SET_TEST_MNEMONIC = '@login/network/SET_TEST_MNEMONIC'
export const NETWORK_SET_TEST_WALLET_FILE = '@login/network/SET_TEST_WALLET_FILE'
export const NETWORK_SET_TEST_RPC = '@login/network/SET_TEST_RPC'
export const NETWORK_SET_TEST_METAMASK = '@login/network/SET_TEST_METAMASK'
export const NETWORK_SET_NETWORK = '@login/network/SET_NETWORK'
export const NETWORK_RESET_NETWORK = '@login/network/NETWORK_RESET_NETWORK'
export const NETWORK_SET_PROVIDER = '@login/network/SET_PROVIDER'
export const NETWORK_SET_NEW_ACCOUNT_CREDENTIALS = '@login/network/SET_NEW_ACCOUNT_CREDENTIALS'
export const NETWORK_RESET_NEW_ACCOUNT_CREDENTIALS = '@login/network/RESET_NEW_ACCOUNT_CREDENTIALS'
export const NETWORK_SET_NEW_MNEMONIC = '@login/network/SET_NEW_MNEMONIC'
export const NETWORK_RESET_NEW_MNEMONIC = '@login/network/RESET_NEW_MNEMONIC'

export const NETWORK_SET_IMPORT_MNEMONIC = '@login/network/SET_IMPORT_MNEMONIC'
export const NETWORK_SET_IMPORT_PRIVATE_KEY = '@login/network/SET_NEW_PRIVATE_KEY'
export const NETWORK_RESET_IMPORT_PRIVATE_KEY = '@login/network/RESET_NEW_PRIVATE_KEY'
export const NETWORK_SET_IMPORT_WALLET_FILE = '@login/network/SET_IMPORT_WALLET_FILE'
export const NETWORK_RESET_IMPORT_WALLET_FILE = '@login/network/RESET_IMPORT_WALLET_FILE'
export const NETWORK_SET_IMPORT_ACCOUNT_MODE = '@login/network/SET_IMPORT_ACCOUNT_MODE'
export const NETWORK_RESET_IMPORT_ACCOUNT_MODE = '@login/network/RESET_IMPORT_ACCOUNT_MODE'
export const NETWORK_SET_LOGIN_SUBMITTING = '@login/network/SET_LOGIN_SUBMITTING'
export const NETWORK_RESET_LOGIN_SUBMITTING = '@login/network/RESET_LOGIN_SUBMITTING'
export const NETWORK_SET_ACCOUNT_RECOVERY_MODE = '@login/network/SET_ACCOUNT_RECOVERY_MODE'
export const NETWORK_RESET_ACCOUNT_RECOVERY_MODE = '@login/network/RESET_ACCOUNT_RECOVERY_MODE'
export const NETWORK_SET_PROFILE_SIGNATURE = '@login/network/SET_PROFILE_SIGNATURE'

export const NETWORK_ACCOUNTS_SIGNATURES_LOADING = '@login/network/ACCOUNTS_SIGNATURES_LOADING'
export const NETWORK_ACCOUNTS_SIGNATURES_RESET_LOADING = '@login/network/ACCOUNTS_SIGNATURES_RESET_LOADING'
export const NETWORK_ACCOUNTS_SIGNATURES_RESOLVE = '@login/network/ACCOUNTS_SIGNATURES_RESOLVE'
export const NETWORK_ACCOUNTS_SIGNATURES_REJECT = '@login/network/ACCOUNTS_SIGNATURES_REJECT'
export const NETWORK_SET_WALLET_FILE_IMPORTED = '@login/network/SET_WALLET_FILE_IMPORTED'
export const NETWORK_RESET_WALLET_FILE_IMPORTED = '@login/network/RESET_WALLET_FILE_IMPORTED'

export const loading = (isLoading = true) => ({
  type: NETWORK_LOADING,
  isLoading,
})

export const networkSetNetwork = (selectedNetworkId) => ({
  type: NETWORK_SET_NETWORK,
  selectedNetworkId,
})

export const networkResetNetwork = () => ({
  type: NETWORK_RESET_NETWORK,
})

export const networkSetProvider = (selectedProviderId) => ({
  type: NETWORK_SET_PROVIDER,
  selectedProviderId,
})

export const addError = (error) => ({
  type: NETWORK_ADD_ERROR,
  error,
})

export const clearErrors = () => ({
  type: NETWORK_CLEAR_ERRORS,
})

export const networknetworkResetImportAccountMode = () => ({
  type: NETWORK_RESET_IMPORT_ACCOUNT_MODE,
})

export const networkSetAccounts = (accounts) => ({
  type: NETWORK_SET_ACCOUNTS,
  accounts,
})

export const networkResetImportPrivateKey = () => ({
  type: NETWORK_RESET_IMPORT_PRIVATE_KEY,
})

export const networkResetImportWalletFile = () => ({
  type: NETWORK_RESET_IMPORT_WALLET_FILE,
})

export const networkResetAccountRecoveryMode = () => ({
  type: NETWORK_RESET_ACCOUNT_RECOVERY_MODE,
})

export const networkResetNewMnemonic = () => ({
  type: NETWORK_RESET_NEW_MNEMONIC,
})

export const networkResetNewAccountCredential = () => ({
  type: NETWORK_RESET_NEW_ACCOUNT_CREDENTIALS,
})

export const networkResetWalletFileImported = () => ({
  type: NETWORK_RESET_WALLET_FILE_IMPORTED,
})

export const networkResetLoginSubmitting = () => ({
  type: NETWORK_RESET_LOGIN_SUBMITTING,
})

export const loadingAccountsSignatures = () => ({
  type: NETWORK_ACCOUNTS_SIGNATURES_LOADING,
})

export const resetLoadingAccountsSignatures = () => ({
  type: NETWORK_ACCOUNTS_SIGNATURES_RESET_LOADING,
})

export const networkSetNewMnemonic = (mnemonic) => ({
  type: NETWORK_SET_NEW_MNEMONIC,
  mnemonic,
})

export const networkResetImportAccountMode = () => ({
  type: NETWORK_RESET_IMPORT_ACCOUNT_MODE,
})

export const setAccountCredentials = (walletName, walletPassword) => ({
  type: NETWORK_SET_NEW_ACCOUNT_CREDENTIALS,
  walletName,
  walletPassword,
})

export const networkSetImportPrivateKey = (privateKey) => ({
  type: NETWORK_SET_IMPORT_PRIVATE_KEY,
  privateKey,
})

export const setProfileSignature = (signature) => ({
  type: NETWORK_SET_PROFILE_SIGNATURE,
  signature,
})

export const networkSetLoginSubmitting = () => ({
  type: NETWORK_SET_LOGIN_SUBMITTING,
})

export const networkSetAccountRecoveryMode = () => ({
  type: NETWORK_SET_ACCOUNT_RECOVERY_MODE,
})

/*
 * TODO: to add description
 */
export const setImportedWalletFile = (wallet) => ({
  type: NETWORK_SET_WALLET_FILE_IMPORTED,
  wallet,
})

export const setImportWalletFile = () => ({
  type: NETWORK_SET_IMPORT_WALLET_FILE,
})

export const initImportMethodsPage = () => ({
  type: NETWORK_SET_IMPORT_ACCOUNT_MODE,
})
