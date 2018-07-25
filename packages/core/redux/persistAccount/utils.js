/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import {
  profileImgJPG,
} from '@chronobank/core-dependencies/assets'

import {
  AccountEntryModel,
} from '../../models/wallet/persistAccount'

export const replaceWallet = (wallet, walletList) => {
  let index = walletList.findIndex((item) => item.key === wallet.key)

  let copyWalletList = [...walletList]

  copyWalletList.splice(index, 1, wallet)

  return copyWalletList
}

export const removeWallet = (walletsList, name) => {
  return walletsList.filter((w) => w.name !== name)
}

export const getAddress = (address, hexFormat = false) => {
  return `${ hexFormat ? '0x' : ''}${address}`
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

export const getAccountAvatarImg = (account) => {
  if (account && account.profile && account.profile.avatar) {
    return account.profile.avatar
  }

  return ''
}

export const getAccountAvatar = (account: AccountEntryModel) => {
  const img = getAccountAvatarImg(account)

  return img || profileImgJPG
}
