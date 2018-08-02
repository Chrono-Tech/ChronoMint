/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import hdkey from 'ethereumjs-wallet/hdkey'
import Accounts from 'web3-eth-accounts'
import uuid from 'uuid/v1'
import bip39 from 'bip39'
import profileService from '@chronobank/login/network/ProfileService'
import {
  profileImgJPG,
} from '@chronobank/core-dependencies/assets'
import mnemonicProvider from '@chronobank/login/network/mnemonicProvider'
import {
  WALLET_HD_PATH,
} from '@chronobank/login/network/constants'
import {
  AccountEntryModel,
  AccountProfileModel,
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

export const getProfilesForAccounts = (walletsList) => async () => {

  const addresses = getWalletsListAddresses(walletsList)
  const { data } = await profileService.getPersonInfo(addresses)

  if (!Array.isArray(data)) {
    return walletsList
  }

  return data
    .reduce((accumulator, profile) => {
      const updatedProfileAccounts = walletsList
        .filter((wallet) =>
          getAccountAddress(wallet, true) === profile.address
        )
        .map((account) => {
          const profileModel = profile && new AccountProfileModel(profile)
          return new AccountEntryModel({
            ...account,
            profile: profileModel || null,
          })
        })

      return [...accumulator, ...updatedProfileAccounts]
    }, [])
}

export const createAndSetAccount = async ({ name, password, privateKey, mnemonic, numberOfAccounts = 0, types = {} }) => {
  let hex = ''

  if (privateKey){
    hex = `0x${privateKey}`
  }

  if (mnemonic){
    hex = hdkey
      .fromMasterSeed(bip39.mnemonicToSeed(mnemonic))
      .derivePath(WALLET_HD_PATH)
      .getWallet()
      .getPrivateKeyString()
  }

  const accounts = new Accounts()

  let wallet = await accounts.wallet.create(numberOfAccounts)
  const account = accounts.privateKeyToAccount(hex)
  wallet.add(account)

  const entry = new AccountEntryModel({
    key: uuid(),
    name,
    types,
    encrypted: wallet && wallet.encrypt(password),
    profile: null,
  })

  const newAccounts = getProfilesForAccounts([entry])

  return newAccounts[0] || entry
}

export const createAccountEntry = (name, walletFileImportObject, profile = null) =>
  new AccountEntryModel({
    key: uuid(),
    name,
    encrypted: [walletFileImportObject],
    profile,
  })

export const validateMnemonicForAccount = (mnemonic, selectedWallet: AccountEntryModel) => {
  const addressFromWallet = selectedWallet && getAccountAddress(selectedWallet, true)
  const address = mnemonicProvider
    .createEthereumWallet(mnemonic)
    .getAddressString()

  return addressFromWallet === address
}
