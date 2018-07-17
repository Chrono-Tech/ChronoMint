/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { DUCK_WALLETS } from '../actions'

export const getWallet = (walletId) => (state) => {
  return state.get(DUCK_WALLETS).list[walletId]
}

export const getWallets = (state) => {
  return state.get(DUCK_WALLETS).list
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

