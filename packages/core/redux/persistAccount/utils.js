/**
 * Copyright 2017–2019, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import uuid from 'uuid/v1'
import { WALLET_TYPE_MEMORY } from '../../models/constants/AccountEntryModel'
import { AccountEntryModel } from '../../models/wallet/persistAccount'
import EthereumMemoryDevice, { DEFAULT_PATH } from '../../services/signers/EthereumMemoryDevice'
import { DEFAULT_ACTIVE_BLOCKCHAINS } from './constants'

export const replaceWallet = (wallet, walletList) => {
  const index = walletList.findIndex((item) => item.key === wallet.key)
  const copyWalletList = [...walletList]
  copyWalletList.splice(index, 1, wallet)

  return copyWalletList
}

/**
 *
 * @param blockchainList {Bitcoin: true, Litecoin: false} an example of blockchainList format
 */
export const formatBlockchainListToArray = (blockchainList, filterFunction) => {
  return Object.entries(blockchainList)
    .filter(([name, isEnabled]) => filterFunction(name, isEnabled))
    .map(([name]) => name)
}

export const getAddress = (address, /*hexFormat = false*/) => {
  return address//`${ hexFormat ? '0x' : ''}${address}`
}

export const getAccountAddress = (account: AccountEntryModel) => {
  return account && account.encrypted && account.encrypted[0] && getAddress(account.encrypted[0].address) || ''
}

export const getWalletsListAddresses = (walletsList = []) => {
  return walletsList.map((wallet) => getAccountAddress(wallet))
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
    blockchainList: DEFAULT_ACTIVE_BLOCKCHAINS,
  })
}

export const createDeviceAccountEntry = (
  name,
  device,
  profile = null,
  walletType = null,
  blockchainList = DEFAULT_ACTIVE_BLOCKCHAINS
) => {
  if (!walletType) {
    throw new Error('WalletDeviceType is empty')
  }

  return new AccountEntryModel({
    key: uuid(),
    name,
    type: walletType,
    encrypted: [device],
    profile,
    blockchainList,
  })
}

export const validateMnemonicForAccount = (mnemonic, selectedWallet: AccountEntryModel) => {
  const addressFromWallet = selectedWallet && getAccountAddress(selectedWallet)
  const address = getAddressByMnemonic(mnemonic)

  return addressFromWallet === address
}

export const getAddressByMnemonic = (mnemonic) => {
  return EthereumMemoryDevice
    .getDerivedWallet(mnemonic, null)
    .address
}
