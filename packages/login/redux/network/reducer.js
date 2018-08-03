/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { getNetworksByProvider, providerMap } from '../../network/settings'
import * as actions from './constants'

const initialState = {
  isLoading: false,
  isLocal: false,
  isMetamask: false,
  isMnemonic: false,
  isWalletFile: false,
  accounts: [],
  selectedAccount: null,
  errors: [],
  providers: [
    providerMap.chronoBank,
    providerMap.infura,
    providerMap.mew,
    providerMap.giveth,
  ],
  priority: [
    providerMap.infura.id,
    providerMap.chronoBank.id,
    providerMap.mew.id,
    providerMap.giveth.id,
  ],
  preferMainnet: process.env.NODE_ENV === 'production',
  selectedProviderId: null,
  networks: [],
  selectedNetworkId: null,
  newAccountName: null,
  newAccountPassword: null,
  newAccountMnemonic: null,
  newAccountPrivateKey: null,
  isLoginSubmitting: false,
  accountRecoveryMode: false,
  walletFileImportMode: false,
  walletFileImportObject: null,
  accountSignaturesLoading: false,
  accountSignaturesData: null,
  accountSignaturesError: null,
}

// eslint-disable-next-line complexity
export default (state = initialState, action) => {
  switch (action.type) {
    case actions.NETWORK_LOADING:
      return {
        ...state,
        isLoading: action.isLoading,
      }
    case actions.NETWORK_SET_TEST_RPC:
      return {
        ...state,
        isLocal: true,
      }
    case actions.NETWORK_SET_TEST_METAMASK:
      return {
        ...state,
        isMetamask: true,
      }
    case actions.NETWORK_SET_NETWORK:
      return {
        ...state,
        selectedNetworkId: action.selectedNetworkId,
      }
    case actions.NETWORK_RESET_NETWORK:
      return {
        ...state,
        selectedNetworkId:  null,
      }
    case actions.NETWORK_SET_PROVIDER:
      return {
        ...state,
        selectedProviderId: action.selectedProviderId,
        networks: getNetworksByProvider(action.selectedProviderId, state.isLocal),
      }
    case actions.NETWORK_SET_ACCOUNTS:
      return { ...state, accounts: action.accounts }
    case actions.NETWORK_SELECT_ACCOUNT:
      return { ...state, selectedAccount: action.selectedAccount }
    case actions.NETWORK_CLEAR_ERRORS:
      return { ...state, errors: [] }
    case actions.NETWORK_SET_TEST_MNEMONIC:
      return { ...state, isMnemonic: true }
    case actions.NETWORK_SET_TEST_WALLET_FILE:
      return { ...state, isWalletFile: true }
    case actions.NETWORK_ADD_ERROR:
      return {
        ...state,
        isLoading: false,
        errors: [...state.errors, action.error],
      }
    case actions.NETWORK_SET_NEW_ACCOUNT_CREDENTIALS:
      return {
        ...state,
        newAccountName: action.walletName,
        newAccountPassword: action.walletPassword,
      }
    case actions.NETWORK_RESET_NEW_ACCOUNT_CREDENTIALS:
      return {
        ...state,
        newAccountName: null,
        newAccountPassword: null,
      }
    case actions.NETWORK_SET_NEW_MNEMONIC:
      return {
        ...state,
        newAccountMnemonic: action.mnemonic,
      }
    case actions.NETWORK_RESET_NEW_MNEMONIC:
      return {
        ...state,
        newAccountMnemonic: null,
      }
    case actions.NETWORK_SET_IMPORT_PRIVATE_KEY:
      return {
        ...state,
        newAccountPrivateKey: action.privateKey,
      }
    case actions.NETWORK_RESET_IMPORT_PRIVATE_KEY:
      return {
        ...state,
        newAccountPrivateKey: null,
      }
    case actions.NETWORK_SET_IMPORT_ACCOUNT_MODE:
      return {
        ...state,
        importAccountMode: true,
      }
    case actions.NETWORK_RESET_IMPORT_ACCOUNT_MODE:
      return {
        ...state,
        importAccountMode: false,
      }
    case actions.NETWORK_SET_LOGIN_SUBMITTING:
      return {
        ...state,
        isLoginSubmitting: true,
      }
    case actions.NETWORK_RESET_LOGIN_SUBMITTING:
      return {
        ...state,
        isLoginSubmitting: false,
      }
    case actions.NETWORK_SET_ACCOUNT_RECOVERY_MODE:
      return {
        ...state,
        accountRecoveryMode: true,
      }
    case actions.NETWORK_RESET_ACCOUNT_RECOVERY_MODE:
      return {
        ...state,
        accountRecoveryMode: false,
      }
    case actions.NETWORK_SET_IMPORT_WALLET_FILE:
      return {
        ...state,
        walletFileImportMode: true,
      }
    case actions.NETWORK_RESET_IMPORT_WALLET_FILE:
      return {
        ...state,
        walletFileImportMode: false,
      }
    case actions.NETWORK_ACCOUNTS_SIGNATURES_LOADING:
      return {
        ...state,
        loadingAccountSignatures: true,
      }
    case actions.NETWORK_ACCOUNTS_SIGNATURES_RESET_LOADING:
      return {
        ...state,
        loadingAccountSignatures: false,
      }

    case actions.NETWORK_SET_WALLET_FILE_IMPORTED:
      return {
        ...state,
        walletFileImportObject: action.wallet,
      }
    case actions.NETWORK_RESET_WALLET_FILE_IMPORTED:
      return {
        ...state,
        walletFileImportObject: null,
      }
    default:
      return state
  }
}
