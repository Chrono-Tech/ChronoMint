/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import uuid from 'uuid/v1'
import bip39 from 'bip39'
import Web3 from 'web3'
import Accounts from 'web3-eth-accounts'
import {
  AccountEntryModel,
  AccountProfileModel,
} from '@chronobank/core/models/wallet/persistAccount'
import {
  getWalletsListAddresses,
  getAccountAddress,
} from '@chronobank/core/redux/persistAccount/utils'
import networkService from '@chronobank/login/network/NetworkService'
import profileService from '@chronobank/login/network/ProfileService'

export const WALLETS_ADD = 'persistAccount/WALLETS_ADD'
export const WALLETS_SELECT = 'persistAccount/WALLETS_SELECT'
export const WALLETS_LOAD = 'persistAccount/WALLETS_LOAD'
export const WALLETS_UPDATE_LIST = 'persistAccount/WALLETS_UPDATE_LIST'
export const WALLETS_REMOVE = 'persistAccount/WALLETS_REMOVE'

export const accountAdd = (wallet) => (dispatch) => {
  dispatch({ type: WALLETS_ADD, wallet })
}

export const accountSelect = (wallet) => (dispatch) => {
  dispatch({ type: WALLETS_SELECT, wallet })
}

export const accountLoad = (wallet) => (dispatch) => {
  dispatch({ type: WALLETS_LOAD, wallet })
}

export const accountUpdateList = (walletList) => (dispatch) => {
  dispatch({ type: WALLETS_UPDATE_LIST, walletList })
}

export const accountUpdate = (wallet) => (dispatch, getState) => {
  const state = getState()

  const { walletsList } = state.get('persistAccount')

  let index = walletsList.findIndex((item) => item.key === wallet.key)

  let copyWalletList = [...walletsList]

  copyWalletList.splice(index, 1, wallet)

  dispatch({ type: WALLETS_UPDATE_LIST, walletsList: copyWalletList })

}

export const decryptAccount = (encrypted, password) => async (dispatch) => {

  const web3 = new Web3()
  const accounts = new Accounts(new web3.providers.HttpProvider(networkService.getProviderSettings().url))
  await accounts.wallet.clear()

  let wallet = await accounts.wallet.decrypt(encrypted, password)

  return wallet

}

export const validateAccountName = (name) => (dispatch, getState) => {
  const state = getState()

  const { walletsList } = state.get('persistAccount')

  return !walletsList.find((item) => item.name === name)
}

export const validateMnemonicForAccount = (wallet, mnemonic) => async () => {
  let host = networkService.getProviderSettings().url

  const web3 = new Web3()
  const accounts = new Accounts(new web3.providers.HttpProvider(host))
  accounts.wallet.clear()

  const addressFromWallet = wallet && getAccountAddress(wallet, true)

  const account = accounts.privateKeyToAccount(`0x${bip39.mnemonicToSeedHex(mnemonic)}`)
  const address = account && account.address && account.address.toLowerCase()

  return addressFromWallet === address
}

export const resetPasswordAccount = (wallet, mnemonic, password) => async (dispatch) => {
  let host = networkService.getProviderSettings().url

  const web3 = new Web3()
  const accounts = new Accounts(new web3.providers.HttpProvider(host))
  accounts.wallet.clear()

  const newCopy = await dispatch(createAccount({ name: wallet.name, mnemonic, password }))


  let newWallet = {
    ...wallet,
    encrypted: newCopy.encrypted,
  }

  dispatch(accountUpdate(newWallet))

  dispatch(accountSelect(newWallet))

}

export const createAccount = ({ name, password, privateKey, mnemonic, numberOfAccounts = 0, types = {} }) => async (dispatch, getState) => {
  const state = getState()

  let wallet, hex = privateKey || bip39.mnemonicToSeedHex(mnemonic) || ''

  let host = networkService.getProviderSettings().url

  const web3 = new Web3()
  const accounts = new Accounts(new web3.providers.HttpProvider(host))
  accounts.wallet.clear()

  wallet = await accounts.wallet.create(numberOfAccounts)
  const account = accounts.privateKeyToAccount(`0x${hex}`)
  wallet.add(account)

  const entry = new AccountEntryModel({
    key: uuid(),
    name,
    types,
    encrypted: wallet && wallet.encrypt(password),
    profile: null,
  })

  const newAccounts = await dispatch(setProfilesForAccounts([entry]))

  return newAccounts[0] || entry

}

export const downloadWallet = () => (dispatch, getState) => {
  const state = getState()

  const { selectedWallet } = state.get('persistAccount')

  if (selectedWallet) {
    const walletName = selectedWallet.name || 'Wallet'
    const text = JSON.stringify(selectedWallet.encrypted.length > 1 ? selectedWallet.encrypted : selectedWallet.encrypted[0])
    const element = document.createElement('a')
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text))
    element.setAttribute('download', `${walletName}.wlt`)
    element.style.display = 'none'
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }
}

export const setProfilesForAccounts = (walletsList) => async () => {

  const addresses = getWalletsListAddresses(walletsList)
  const { data } = await profileService.getPersonInfo(addresses)

  if (Array.isArray(data)) {
    return data.map((profile) => {
      const account = walletsList.find((wallet) => getAccountAddress(wallet, true) === profile.address)

      const profileModel = profile && new AccountProfileModel(profile) || null
      return new AccountEntryModel({
        ...account,
        profile: profileModel,
      })
    })
  } else {
    return walletsList
  }
}

export const logout = () => (dispatch) => {
  dispatch(accountSelect(null))
  dispatch(accountLoad(null))
  // Router.pushRoute('/')
}
