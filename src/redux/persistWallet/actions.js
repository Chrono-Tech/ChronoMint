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

  const { walletsList } = state.wallet

  let index = walletsList.findIndex((item) => item.key === wallet.key)

  let copyWalletList = [...walletsList]

  copyWalletList.splice(index, 1, wallet)

  const updatedWalletList = copyWalletList

  dispatch(walletSelect(wallet))

  dispatch({ type: WALLETS_UPDATE_LIST, walletsList: updatedWalletList })

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

export const validateMnemonicForWallet = (wallet, mnemonic) => () => {
  const web3 = web3Provider.getWeb3instance()

  if (!web3){
    return
  }

  web3.eth.accounts.wallet.clear()

  const walletAddress = wallet && wallet.encrypted && wallet.encrypted[0] && wallet.encrypted[0].address || ''

  const addressFromWallet = `0x${walletAddress}`

  const account = web3.eth.accounts.privateKeyToAccount(`0x${bip39.mnemonicToSeedHex(mnemonic)}`)
  const address = account && account.address && account.address.toLowerCase()

  return addressFromWallet === address
}

export const resetPasswordWallet = (wallet, mnemonic, password) => (dispatch) => {
  const web3 = web3Provider.getWeb3instance()

  if (!web3){
    return
  }

  web3.eth.accounts.wallet.clear()

  const newCopy = dispatch(createWallet({ name: wallet.name, mnemonic, password }))

  let newWallet = {
    ...wallet,
    encrypted: newCopy.encrypted,
  }

  dispatch(walletUpdate(newWallet))
}

export const createWallet = ({ name, password, privateKey, mnemonic, numberOfAccounts = 0, types = {} }) => async (dispatch, getState) => {
  const state = getState()

  const selectedNetwork = getSelectedNetwork()(state)
  let wallet, hex =  privateKey || bip39.mnemonicToSeedHex(mnemonic) || ''

  if (!selectedNetwork){
    return
  }

  const host = `${selectedNetwork.protocol}://${selectedNetwork.host}`

  const web3 = new Web3()
  const accounts = new Accounts(host)
  accounts.wallet.clear()

  console.log('createWallet', hex, selectedNetwork, accounts, name, password, privateKey, mnemonic, numberOfAccounts)

  wallet = await accounts.wallet.create(numberOfAccounts)
  const account = accounts.privateKeyToAccount(`0x${hex}`)
  wallet.add(account)

  return new WalletEntryModel({
    key: uniqid(),
    name,
    types,
    encrypted: wallet && wallet.encrypt(password),
  })

}

export const logout = () => (dispatch) => {
  dispatch(walletSelect(null))
  dispatch(walletLoad(null))
  // Router.pushRoute('/')
}
