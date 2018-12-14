/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import * as types from './constants'

export const updateWeb3 = (web3) =>
  ({
    type: types.LABOR_HOUR_WEB3_UPDATE,
    web3,
  })

export const updateWallet = (wallet) =>
  ({
    type: types.LABOR_HOUR_UPDATE_WALLET,
    wallet,
  })

export const txCreate = (entry) =>
  ({
    type: types.LABOR_HOUR_TX_CREATE,
    entry,
  })

export const txUpdate = (key, address, tx) =>
  ({
    type: types.LABOR_HOUR_TX_UPDATE,
    address,
    key,
    tx,
  })

export const txRemove = (key, address) =>
  ({
    type: types.LABOR_HOUR_TX_REMOVE,
    address,
    key,
  })

export const daosRegister = (model) =>
  ({
    type: types.LABOR_HOUR_DAOS_REGISTER,
    model,
  })

export const swapUpdate = (swap) =>
  ({
    type: types.LABOR_HOUR_SWAP_UPDATE,
    swap,
  })

export const swapListUpdate = (swaps) =>
  ({
    type: types.LABOR_HOUR_SWAP_LIST_UPDATE,
    swaps,
  })

export const setTokensFetchingCount = (count) =>
  ({
    type: types.LABOR_HOUR_TOKENS_FETCHING,
    count,
  })

export const tokenFetched = (token) =>
  ({
    type: types.LABOR_HOUR_TOKENS_FETCHED,
    token,
  })

export const tokensLoadingFailed = () =>
  ({
    type: types.LABOR_HOUR_TOKENS_FAILED,
  })

export const updateMiningParams = (minDepositLimit, rewardsCoefficient) =>
  ({
    type: types.LABOR_HOUR_DEPOSIT_PARAMS_UPDATE,
    minDepositLimit,
    rewardsCoefficient,
  })

/**
 *
 * @param miningParams { isCustomNode, delegateAddress }
 * @returns {{type: string, isCustomNode: *, delegateAddress: *}}
 */
export const updateMiningNodeType = (miningParams) =>
  ({
    type: types.LABOR_HOUR_UPDATE_MINING_NODE_TYPE,
    miningParams,
  })

export const updateDeposit = (address, amount) =>
  ({
    type: types.LABOR_HOUR_UPDATE_DEPOSIT,
    address,
    amount,
  })

export const updateLockedDeposit = (address, amount) =>
  ({
    type: types.LABOR_HOUR_UPDATE_LOCKED_DEPOSIT,
    address,
    amount,
  })

export const updateMiningFeeMultiplier = (feeMultiplier) =>
  ({
    type: types.LABOR_HOUR_UPDATE_FEE_MULTIPLIER,
    feeMultiplier,
  })

export const updateProcessingStatus = (status) =>
  ({
    type: types.LABOR_HOUR_UPDATE_PROCESSING_STATUS,
    status,
  })

export const setLatestBlock = (blockchain, block) =>
  ({
    type: types.LABOR_HOUR_TOKENS_UPDATE_LATEST_BLOCK,
    blockchain,
    block,
  })

export const setMiddlewareConnectionStatus = (status) =>
  ({
    type: types.LABOR_HOUR_UPDATE_MIDDLEWARE_CONNECTING_STATUS,
    status,
  })

export const setTotalRewards = (total) =>
  ({
    type: types.LABOR_HOUR_UPDATE_TOTAL_REWARDS,
    total,
  })

export const setRewardsBlocksList = (list) =>
  ({
    type: types.LABOR_HOUR_UPDATE_REWARDS_BLOCKS_LIST,
    list,
  })
