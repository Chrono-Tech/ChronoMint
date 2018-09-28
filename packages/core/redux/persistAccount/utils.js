/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import uuid from 'uuid/v1'
import { DEFAULT_PATH } from '@chronobank/core/services/signers/EthereumMemoryDevice'
import { WALLET_TYPE_MEMORY } from '../../models/constants/AccountEntryModel'
import { AccountEntryModel } from '../../models/wallet/persistAccount'
import EthereumMemoryDevice from '../../services/signers/EthereumMemoryDevice'

export const replaceWallet = (wallet, walletList) => {
  const index = walletList.findIndex((item) => item.key === wallet.key)
  const copyWalletList = [...walletList]
  copyWalletList.splice(index, 1, wallet)

  return copyWalletList
}

export const getAddress = (address, /*hexFormat = false*/) => {
  return address//`${ hexFormat ? '0x' : ''}${address}`
}

export const getAccountAddress = (account: AccountEntryModel, hexFormat = false) => {
  return account && account.encrypted && account.encrypted[0] && getAddress(account.encrypted[0].address, hexFormat) || ''
}

export const getWalletsListAddresses = (walletsList = []) => {
  return walletsList.map((wallet) => getAccountAddress(wallet, true))
}

export const walletAddressExistInWalletsList = (wallet, walletsList = []) => {
  return walletsList.find((w) => getAccountAddress(w) === getAccountAddress(wallet))
}

export const getAccountName = (account: AccountEntryModel) => {
  if (account && account.profile && account.profile.userName) {
    return account.profile.userName
  }

  return account && account.name || ''
}

export const getAccountAvatar = (account) => {
  if (account && account.profile && account.profile.avatar) {
    return account.profile.avatar
  }

  return ''
}

export const createAccountEntry = (name, walletFileImportObject, profile = null) => {

  // wallet JSON updated for our format to list it on login page
  const updatedWalletJSON = {
    wallet: walletFileImportObject,
    type: WALLET_TYPE_MEMORY,
    path: DEFAULT_PATH,
    address: `0x${walletFileImportObject.address}`,
  }

  return new AccountEntryModel({
    key: uuid(),
    name,
    type: WALLET_TYPE_MEMORY,
    encrypted: [updatedWalletJSON],
    profile,
  })
}

export const createDeviceAccountEntry = (name, device, profile = null, walletType = null) => {
  if (!walletType) {
    throw new Error('WalletDeviceType is empty')
  }

  return new AccountEntryModel({
    key: uuid(),
    name,
    type: walletType,
    encrypted: [device],
    profile,
  })
}

export const validateMnemonicForAccount = (mnemonic, selectedWallet: AccountEntryModel) => {
  const addressFromWallet = selectedWallet && getAccountAddress(selectedWallet, true)
  const address = getAddressByMnemonic(mnemonic)

  return addressFromWallet === address
}

export const getAddressByMnemonic = (mnemonic) => {
  return EthereumMemoryDevice
    .getDerivedWallet(mnemonic, null)
    .address
}
