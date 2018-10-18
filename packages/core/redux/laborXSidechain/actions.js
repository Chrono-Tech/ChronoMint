/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import {
  LABOR_X_SIDECHAIN_DAOS_REGISTER, LABOR_X_SIDECHAIN_SWAP_UPDATE,
  LABOR_X_SIDECHAIN_TX_CREATE,
  LABOR_X_SIDECHAIN_TX_REMOVE,
  LABOR_X_SIDECHAIN_TX_UPDATE,
  LABOR_X_SIDECHAIN_TOKENS_FETCHING,
  LABOR_X_SIDECHAIN_TOKENS_FETCHED,
  LABOR_X_SIDECHAIN_TOKENS_FAILED,
  LABOR_X_SIDECHAIN_UPDATE_WALLET,
  LABOR_X_SIDECHAIN_WEB3_UPDATE,
} from './constants'

export const updateWeb3 = (web3) =>
  ({
    type: LABOR_X_SIDECHAIN_WEB3_UPDATE,
    web3,
  })

export const updateWallet = (wallet) =>
  ({
    type: LABOR_X_SIDECHAIN_UPDATE_WALLET,
    wallet,
  })

export const txCreate = (entry) =>
  ({
    type: LABOR_X_SIDECHAIN_TX_CREATE,
    entry,
  })

export const txUpdate = (key, address, tx) =>
  ({
    type: LABOR_X_SIDECHAIN_TX_UPDATE,
    address,
    key,
    tx,
  })

export const txRemove = (key, address) =>
  ({
    type: LABOR_X_SIDECHAIN_TX_REMOVE,
    address,
    key,
  })

export const daosRegister = (model) =>
  ({
    type: LABOR_X_SIDECHAIN_DAOS_REGISTER,
    model,
  })

export const swapUpdate = (swap) =>
  ({
    type: LABOR_X_SIDECHAIN_SWAP_UPDATE,
    swap,
  })

export const setTokensFetchingCount = (count) =>
  ({
    type: LABOR_X_SIDECHAIN_TOKENS_FETCHING,
    count,
  })

export const tokenFetched = (token) =>
  ({
    type: LABOR_X_SIDECHAIN_TOKENS_FETCHED,
    token,
  })

export const tokensLoadingFailed = () =>
  ({
    type: LABOR_X_SIDECHAIN_TOKENS_FAILED,
  })
