/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import uniqid from 'uniqid'
import bip39 from 'bip39'
import Web3 from 'web3'
import Accounts from 'web3-eth-accounts'

import web3Provider from '@chronobank/login/network/Web3Provider'
import {
  WalletModel,
  WalletEntryModel,
} from 'models/persistWallet'
import networkService from '@chronobank/login/network/NetworkService'
import mnemonicProvider from '@chronobank/login/network/mnemonicProvider'
import privateKeyProvider from '@chronobank/login/network/privateKeyProvider'
import { clearErrors, loading } from '@chronobank/login/redux/network/actions'
import { getSelectedNetwork } from './selectors'

export const WALLETS_ADD = 'persistWallet/WALLETS_ADD'
export const WALLETS_SELECT = 'persistWallet/WALLETS_SELECT'
export const WALLETS_LOAD = 'persistWallet/WALLETS_LOAD'
export const WALLETS_UPDATE_LIST = 'persistWallet/WALLETS_UPDATE_LIST'
export const WALLETS_REMOVE = 'persistWallet/WALLETS_REMOVE'

export const walletAdd = (wallet) => (dispatch) => {
  dispatch({ type: WALLETS_ADD, wallet })
}

export const walletSelect = (wallet) => (dispatch) => {
  dispatch({ type: WALLETS_SELECT, wallet })
}

export const walletLoad = (wallet) => (dispatch) => {
  dispatch({ type: WALLETS_LOAD, wallet })
}

export const walletUpdateList = (walletList) => (dispatch) => {
  dispatch({ type: WALLETS_UPDATE_LIST, walletList })
}

export const walletUpdate = (wallet) => (dispatch, getState) => {
  const state = getState()

  const { walletsList } = state.get('persistWallet')

  let index = walletsList.findIndex((item) => item.key === wallet.key)

  let copyWalletList = [...walletsList]

  copyWalletList.splice(index, 1, wallet)

  dispatch({ type: WALLETS_UPDATE_LIST, walletsList: copyWalletList })

}

export const decryptWallet = (entry, password) => async (dispatch, getState) => {
  const state = getState()

  const web3 = new Web3()
  const accounts = new Accounts(new web3.providers.HttpProvider(networkService.getProviderSettings().url))
  await accounts.wallet.clear()
  console.log('decrypt', entry, accounts, web3)

  let wallet = await accounts.wallet.decrypt(entry.encrypted, password)
  console.log('decrypt', wallet)

  const model = new WalletModel({
    entry,
    wallet,
  })

  dispatch(walletLoad(model))

  return wallet

}

export const validateWalletName = (name) => (dispatch, getState) => {
  const state = getState()

  const { walletsList } = state.get('persistWallet')

  return !walletsList.find((item) => item.name === name)
}

export const validateMnemonicForWallet = (wallet, mnemonic) => async () => {
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

export const resetPasswordWallet = (wallet, mnemonic, password) => async (dispatch) => {
  let host = networkService.getProviderSettings().url

  const web3 = new Web3()
  const accounts = new Accounts(new web3.providers.HttpProvider(host))
  accounts.wallet.clear()

  const newCopy = await dispatch(createWallet({ name: wallet.name, mnemonic, password }))

  let newWallet = {
    ...wallet,
    encrypted: newCopy.encrypted,
  }

  console.log('resetpwd', newWallet, newCopy, wallet, mnemonic, password)
  dispatch(walletUpdate(newWallet))

  dispatch(walletSelect(newWallet))

}

export const createWallet = ({ name, password, privateKey, mnemonic, numberOfAccounts = 0, types = {} }) => async (dispatch, getState) => {
  const state = getState()

  let wallet, hex = privateKey || bip39.mnemonicToSeedHex(mnemonic) || ''

  let host = networkService.getProviderSettings().url

  const web3 = new Web3()
  const accounts = new Accounts(new web3.providers.HttpProvider(host))
  accounts.wallet.clear()

  wallet = await accounts.wallet.create(numberOfAccounts)
  console.log('createwallet', hex, privateKey, mnemonic)
  const account = accounts.privateKeyToAccount(`0x${hex}`)
  wallet.add(account)

  return new WalletEntryModel({
    key: uniqid(),
    name,
    types,
    encrypted: wallet && wallet.encrypt(password),
  })

}

export const downloadWallet = () => (dispatch, getState) => {
  const state = getState()

  const { selectedWallet } = state.get('persistWallet')

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
  dispatch(walletSelect(null))
  dispatch(walletLoad(null))
  // Router.pushRoute('/')
}
