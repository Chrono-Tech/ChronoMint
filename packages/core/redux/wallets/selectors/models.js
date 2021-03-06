/**
 * Copyright 2017–2019, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { DUCK_WALLETS } from '../constants'
import { BLOCKCHAIN_ETHEREUM } from '../../../dao/constants'

export const getWallet = (blockchain, address) => (state) => {
  const walletId = `${blockchain}-${address}`
  return state.get(DUCK_WALLETS).list[walletId]
}

export const getWalletById = (walletId) => (state) => {
  return state.get(DUCK_WALLETS).list[walletId]
}

export const getWalletsByBlockchain = (blockchain) => (state) => {
  const wallets = getWallets(state)
  return Object.values(wallets).filter((wallet) => {
    return wallet.blockchain === blockchain
  })
}

export const getWallets = (state) => {
  return state.get(DUCK_WALLETS).list
}

export const getMainEthWallet = (state) => {
  const wallets = getWallets(state)
  return Object.values(wallets).find((wallet) => wallet.isMain && wallet.blockchain === BLOCKCHAIN_ETHEREUM)
}

export const getMainWalletForBlockchain = (blockchain) => (state) => {
  const wallets = getWallets(state)
  return Object.values(wallets).find((wallet) => {
    return wallet.isMain && wallet.blockchain === blockchain
  })
}

export const getMainWallets = (state) => {
  const wallets = getWallets(state)
  return Object.values(wallets).filter((wallet) => wallet.isMain)
}

export const getWalletsLengthFromState = (state) => {
  const wallets = getWallets(state)
  return Object.values(wallets).length
}

export const getMainAddresses = (state) => {
  const wallets = getWallets(state)
  const addresses = []
  Object.values(wallets).forEach((wallet) => {
    if (wallet.isMain) {
      addresses.push(wallet.address)
    }
  })
  return addresses
}

export const getWalletTransactions = (walletId) => (state) => {
  const wallet = getWalletById(walletId)(state)
  return wallet ? wallet.transactions : null
}

export const getTwoFaCheckedFromState = (state) => {
  return state.get(DUCK_WALLETS).twoFAConfirmed
}

export const getIsHave2FAWalletsFromState = (state) => {
  const wallets = getWallets(state)
  let isHave2FAWallet = false
  Object.values(wallets)
    .some((wallet) => {
      if (wallet.is2FA) {
        isHave2FAWallet = true
        return true
      }
    })
  return isHave2FAWallet
}

