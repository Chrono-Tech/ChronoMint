/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 *
 * @flow
 */

import {
  NETWORK_ACCOUNTS_SIGNATURES_LOADING,
  NETWORK_ACCOUNTS_SIGNATURES_REJECT,
  NETWORK_ACCOUNTS_SIGNATURES_RESET_LOADING,
  NETWORK_ACCOUNTS_SIGNATURES_RESOLVE,
  NETWORK_ADD_ERROR,
  NETWORK_CLEAR_ERRORS,
  NETWORK_LOADING,
  NETWORK_RESET_ACCOUNT_RECOVERY_MODE,
  NETWORK_RESET_IMPORT_ACCOUNT_MODE,
  NETWORK_RESET_IMPORT_PRIVATE_KEY,
  NETWORK_RESET_IMPORT_WALLET_FILE,
  NETWORK_RESET_LOGIN_SUBMITTING,
  NETWORK_RESET_NETWORK,
  NETWORK_RESET_NEW_ACCOUNT_CREDENTIALS,
  NETWORK_RESET_NEW_MNEMONIC,
  NETWORK_RESET_WALLET_FILE_IMPORTED,
  NETWORK_SELECT_ACCOUNT,
  NETWORK_SET_ACCOUNT_RECOVERY_MODE,
  NETWORK_SET_ACCOUNTS,
  NETWORK_SET_IMPORT_ACCOUNT_MODE,
  NETWORK_SET_IMPORT_MNEMONIC,
  NETWORK_SET_IMPORT_PRIVATE_KEY,
  NETWORK_SET_IMPORT_WALLET_FILE,
  NETWORK_SET_LOGIN_SUBMITTING,
  NETWORK_SET_NETWORK,
  NETWORK_SET_NEW_ACCOUNT_CREDENTIALS,
  NETWORK_SET_NEW_MNEMONIC,
  NETWORK_SET_PROFILE_SIGNATURE,
  NETWORK_SET_PROVIDER,
  NETWORK_SET_TEST_METAMASK,
  NETWORK_SET_TEST_MNEMONIC,
  NETWORK_SET_TEST_RPC,
  NETWORK_SET_TEST_WALLET_FILE,
  NETWORK_SET_WALLET_FILE_IMPORTED,
} from './constants'

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
