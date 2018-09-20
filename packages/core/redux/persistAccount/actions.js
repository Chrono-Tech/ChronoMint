/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import uuid from 'uuid/v1'
import Accounts from 'web3-eth-accounts'
import * as ProfileThunks from '../profile/thunks'
import * as AccountUtils from './utils'
import EthereumMemoryDevice from '../../services/signers/EthereumMemoryDevice'
import { WALLET_TYPE_MEMORY } from '../../models/constants/AccountEntryModel'
import {
  AccountModel,
  AccountEntryModel,
  AccountProfileModel,
  AccountCustomNetwork,
} from '../../models/wallet/persistAccount'

import {
  CUSTOM_NETWORKS_LIST_ADD,
  CUSTOM_NETWORKS_LIST_RESET,
  CUSTOM_NETWORKS_LIST_UPDATE,
  DUCK_PERSIST_ACCOUNT,
  PERSIST_ACCOUNT_SET_LOCALE,
  PERSIST_ACCOUNT_SIGNATURES_LOADING,
  PERSIST_ACCOUNT_SIGNATURES_RESET_LOADING,
  WALLETS_ADD,
  WALLETS_DESELECT,
  WALLETS_LOAD,
  WALLETS_SELECT,
  WALLETS_UPDATE_LIST,
} from './constants'

export const setSiganturesLoading = () => (dispatch) => {
  dispatch({ type: PERSIST_ACCOUNT_SIGNATURES_LOADING })
}

export const setSiganturesLoadingReset = () => (dispatch) => {
  dispatch({ type: PERSIST_ACCOUNT_SIGNATURES_RESET_LOADING })
}

export const accountAdd = (wallet) => (dispatch) => {
  dispatch({ type: WALLETS_ADD, wallet })
}

export const accountSelect = (wallet) => (dispatch) => {
  dispatch({ type: WALLETS_SELECT, wallet })
}

export const accountDeselect = (wallet) => (dispatch) => {
  dispatch({ type: WALLETS_DESELECT, wallet })
}

export const accountLoad = (wallet) => (dispatch) => {
  dispatch({ type: WALLETS_LOAD, wallet })
}

export const accountUpdateList = (walletList) => (dispatch) => {
  dispatch({ type: WALLETS_UPDATE_LIST, walletList })
}

export const accountUpdate = (wallet) => (dispatch, getState) => {
  const state = getState()

  const { walletsList } = state.get(DUCK_PERSIST_ACCOUNT)
  const index = walletsList.findIndex((item) => item.key === wallet.key)
  const copyWalletList = [...walletsList]

  copyWalletList.splice(index, 1, wallet)

  dispatch({ type: WALLETS_UPDATE_LIST, walletsList: copyWalletList })
}

export const decryptAccount = (entry, password) => async () => {
  const privateKey = EthereumMemoryDevice.decrypt({ entry: entry.encrypted[0].wallet, password })
  const account = new AccountModel({
    entry,
    privateKey,
  })

  return account
}

export const validateAccountName = (name) => (dispatch, getState) => {
  const state = getState()
  const { walletsList } = state.get(DUCK_PERSIST_ACCOUNT)

  return !walletsList.find((item) => item.name === name)
}

export const resetPasswordAccount = (wallet, mnemonic, password) => async (dispatch) => {
  const accounts = new Accounts()
  accounts.wallet.clear()

  const newCopy = await dispatch(createAccount({ name: wallet.name, mnemonic, password }))
  const newWallet = {
    ...wallet,
    encrypted: newCopy.encrypted,
  }

  dispatch(accountUpdate(newWallet))
  dispatch(accountSelect(newWallet))
}

export const createAccount = ({ name, wallet, type }) => async (dispatch) => {
  const entry = new AccountEntryModel({
    key: uuid(),
    name,
    type,
    encrypted: [wallet],
    profile: null,
  })

  const newAccounts = await dispatch(setProfilesForAccounts([entry]))

  return newAccounts[0] || entry
}

export const createMemoryAccount = ({ name, password, mnemonic, privateKey }) => async (dispatch) => {
  const wallet = await EthereumMemoryDevice.create({ privateKey, mnemonic, password })
  const account = await dispatch(createAccount({
    name,
    wallet,
    type: WALLET_TYPE_MEMORY,
  }))
  return account
}

export const downloadWallet = () => (dispatch, getState) => {
  const state = getState()
  const { selectedWallet } = state.get(DUCK_PERSIST_ACCOUNT)

  if (selectedWallet) {
    const walletName = selectedWallet.name || 'Wallet'
    const text = JSON.stringify(selectedWallet.encrypted.length > 1 ? selectedWallet.encrypted : selectedWallet.encrypted[0].wallet)
    const element = document.createElement('a')
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text))
    element.setAttribute('download', `${walletName}.wlt`)
    element.style.display = 'none'
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }
}

export const setProfilesForAccounts = (walletsList) => async (dispatch) => {

  const addresses = AccountUtils.getWalletsListAddresses(walletsList)
  const data = await dispatch(ProfileThunks.getUserInfo(addresses))

  if (Array.isArray(data)) {
    return data.reduce((prev, profile) => {

      const updatedProfileAccounts =
        walletsList
          .filter((wallet) => AccountUtils.getAccountAddress(wallet, true) === profile.address)
          .map((account) => {
            const profileModel = profile && new AccountProfileModel(profile) || null
            return new AccountEntryModel({
              ...account,
              profile: profileModel,
            })
          })

      return [].concat(prev, updatedProfileAccounts)
    }, [])
  } else {
    return walletsList
  }
}

export const logout = () => (dispatch) => {
  dispatch(accountSelect(null))
  dispatch(accountLoad(null))
}

export const customNetworkCreate = (url, ws, alias) => (dispatch) => {
  const network = new AccountCustomNetwork({
    id: uuid(),
    name: alias,
    url,
    ws,
  })

  dispatch(customNetworksListAdd(network))
}

export const customNetworkEdit = (network: AccountCustomNetwork) => (dispatch, getState) => {
  const state = getState()

  const { customNetworksList } = state.get(DUCK_PERSIST_ACCOUNT)
  const foundNetworkIndex = customNetworksList.findIndex((item) => network.id === item.id)

  if (foundNetworkIndex !== -1) {
    const copyNetworksList = [...customNetworksList]
    copyNetworksList.splice(foundNetworkIndex, 1, network)
    dispatch(customNetworksListUpdate(copyNetworksList))
  }
}

export const customNetworksListAdd = (network: AccountCustomNetwork) => (dispatch) => {
  dispatch({ type: CUSTOM_NETWORKS_LIST_ADD, network })
}

export const customNetworksDelete = (network) => (dispatch, getState) => {
  const state = getState()
  const { customNetworksList } = state.get(DUCK_PERSIST_ACCOUNT)
  const updatedNetworkList = customNetworksList.filter((item) => item.id !== network.id)

  dispatch(customNetworksListUpdate(updatedNetworkList))
}

export const customNetworksListUpdate = (list) => (dispatch) => {
  dispatch({ type: CUSTOM_NETWORKS_LIST_UPDATE, list })
}

export const customNetworksListReset = () => (dispatch) => {
  dispatch({ type: CUSTOM_NETWORKS_LIST_RESET })
}

export const setPersistAccountLocale = (locale) => (dispatch) => {
  dispatch({ type: PERSIST_ACCOUNT_SET_LOCALE, locale })
}
