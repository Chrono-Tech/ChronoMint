/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { createSelector } from 'reselect'
import { BLOCKCHAIN_LABOR_HOUR } from '@chronobank/login/network/constants'
import { DUCK_LABOR_HOUR } from '../constants'

export const LXSDuckSelector = (state) => {
  return state.get(DUCK_LABOR_HOUR)
}

export const web3Selector = () =>
  createSelector(LXSDuckSelector, (laborHour) => {
    return laborHour == null ? null : laborHour.web3.value
  })

export const laborHourInitSelector =
  createSelector(LXSDuckSelector, (laborHour) => {
    return laborHour.isInitiated
  })

export const getWallets = (state) => {
  const { wallets } = LXSDuckSelector(state)
  return wallets
}

export const getWallet = (blockchain, address) => (state) => {
  const walletId = `${blockchain}-${address}`
  const wallets = getWallets(state)
  return wallets[walletId]
}

export const getWalletById = (walletId) => (state) => {
  const wallets = getWallets(state)
  return wallets[walletId]
}

export const daosSelector = (state) => {
  const { daos } = LXSDuckSelector(state)
  return daos
}

export const getLXWeb3 = (state) => {
  const { web3 } = LXSDuckSelector(state)
  return web3
}

export const daoByAddress = (address) =>
  createSelector(
    daosSelector,
    (daos) => (address in daos.byAddress ? daos.byAddress[address].dao : null),
  )

export const daoByType = (type) =>
  createSelector(daosSelector, (daos) => {
    return type in daos.byType ? daos.byType[type].dao : null
  })

export const getLXTokens = (state) => {
  const { tokens } = LXSDuckSelector(state)
  return tokens
}

export const getLXToken = (symbol) =>
  createSelector(getLXTokens, (tokens) => {
    return tokens.item(symbol)
  })

export const getLXTokenByAddress = (address) =>
  createSelector(getLXTokens, (tokens) => {
    return tokens.getByAddress(address)
  })

export const getLXSwaps = (state) => {
  const { swaps } = LXSDuckSelector(state)
  return swaps
}

export const getLXDeposits = (state) => {
  const { timeHolder } = LXSDuckSelector(state)
  return timeHolder.deposit
}

export const getLXLockedDeposits = (state) => {
  const { timeHolder } = LXSDuckSelector(state)
  return timeHolder.lockedDeposit
}

export const getLXActiveSwapsCount = createSelector(getLXSwaps, (swaps) => {
  return Object.values(swaps).filter((swap) => swap.isActive).length
})

export const getMiningParams = (state) => {
  const { miningParams } = LXSDuckSelector(state)
  return miningParams
}

export const getMiningFeeMultiplier =
  createSelector(getMiningParams, (miningParams) => {
    return miningParams.feeMultiplier
  })

export const getMainLaborHourWallet = (state) => {
  const wallets = getWallets(state)
  return Object.values(wallets).find(
    (wallet) => wallet.isMain && wallet.blockchain === BLOCKCHAIN_LABOR_HOUR,
  )
}

export const getWalletTransactions = (walletId) => (state) => {
  const wallet = getWalletById(walletId)(state)
  return wallet ? wallet.transactions : null
}

export const getLXDeposit = (address) => createSelector(
  getLXDeposits,
  (deposits) => {
    return deposits[address]
  })

export const getLXLockedDeposit = (address) => createSelector(
  getLXLockedDeposits,
  (deposits) => {
    return deposits[address]
  })
