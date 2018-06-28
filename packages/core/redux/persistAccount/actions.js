/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import uniqid from 'uniqid'
import bip39 from 'bip39'
import Web3 from 'web3'
import Accounts from 'web3-eth-accounts'

import {
  AccountModel,
  AccountEntryModel,
} from '@chronobank/core/models/wallet/persistAccount'
import networkService from '@chronobank/login/network/NetworkService'

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

export const decryptAccount = (encrypted, password) => async (dispatch, getState) => {
  const state = getState()

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

  const walletAddress = wallet && wallet.encrypted && wallet.encrypted[0] && wallet.encrypted[0].address || ''

  const addressFromWallet = `0x${walletAddress}`

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

  return new AccountEntryModel({
    key: uniqid(),
    name,
    types,
    encrypted: wallet && wallet.encrypt(password),
  })

}

export const downloadWallet = () => (dispatch, getState) => {
  const state = getState()

  const { selectedWallet } = state.get('persistAccount')

  if (selectedWallet) {
    const text = JSON.stringify(selectedWallet.encrypted.length > 1 ? selectedWallet.encrypted : selectedWallet.encrypted[0])
    const element = document.createElement('a')
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text))
    element.setAttribute('download', `Wallet.wlt`)
    element.style.display = 'none'
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }
}

export const logout = () => (dispatch) => {
  dispatch(accountSelect(null))
  dispatch(accountLoad(null))
  // Router.pushRoute('/')
}
