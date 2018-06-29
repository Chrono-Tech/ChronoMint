import {
  AccountEntryModel,
  AccountProfileModel,
} from '@chronobank/core/models/wallet/persistAccount'

import profileImgJPG from 'assets/img/profile-photo-1.jpg'

export const replaceWallet = (wallet, walletList) => {
  let index = walletList.findIndex((item) => item.key === wallet.key)

  let copyWalletList = [...walletList]

  copyWalletList.splice(index, 1, wallet)

  return copyWalletList
}

export const removeWallet = (walletsList, name) => {
  return walletsList.filter((w) => w.name !== name)
}

export const getAccountAddress = (account: AccountEntryModel, hexFormat = false) => {
  return account.encrypted && account.encrypted[0] && `${ hexFormat ? '0x' : ''}${account.encrypted[0].address}` || ''
}

export const getWalletsListAddresses = (walletsList = []) => {
  return walletsList.map((wallet) => getAccountAddress(wallet, true))
}

export const walletAddressExistInWalletsList = (wallet, walletsList = []) => {
  return walletsList.find((w) => getAccountAddress(w) === getAccountAddress(wallet))
}


export const getAccountName = (account: AccountEntryModel) => {
  if (account && account.profile && account.profile.userName){
    return account.profile.userName
  }

  return account && account.name || ''
}

export const getAccountAvatar = (account: AccountEntryModel) => {
  if (account && account.profile && account.profile.avatar){
    return account.profile.avatar
  }

  return profileImgJPG
}
