/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import {
  daoByType,
  getMainLaborHourWallet,
  getMiningFeeMultiplier,
  getLXSwapsMtS, getLXDeposit, getMiningParams,
} from '../selectors'
import web3Converter from '../../../utils/Web3Converter'
import SidechainMiddlewareService from '../SidechainMiddlewareService'
import { notifyUnknownError, watchProcessingStatus } from './utilsThunks'
import { executeLaborHourTransaction } from './transactions'
import * as LXSidechainActions from '../actions'
import { BLOCKCHAIN_LABOR_HOUR, TIME } from '../../../dao/constants'
import { depositInSidechain, startMiningInCustomNode } from './mining'
import { getEthereumSigner } from '../../ethereum/selectors'

export const obtainSwapByMiddlewareFromMainnetToSidechain = (swapId) => async (
  dispatch,
  getState,
) => {
  try {
    const signer = getEthereumSigner(getState())
    const {
      data,
    } = await SidechainMiddlewareService.obtainSwapFromMainnetToSidechain(
      swapId,
      signer.getPublicKey(),
    )
    return Promise.resolve({ e: null, data, swapId })
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e)
    dispatch(notifyUnknownError())
    return Promise.resolve({ e, swapId })
  }
}

export const closeSwap = (encodedKey, swapId) => async (dispatch, getState) => {
  const dao = daoByType('AtomicSwapERC20')(getState())
  const signer = getEthereumSigner(getState())
  const feeMultiplier = getMiningFeeMultiplier(getState())

  const key = await signer.decryptWithPrivateKey(encodedKey)

  const tx = {
    ...dao.close(
      web3Converter.stringToBytes(swapId),
      web3Converter.stringToBytes(key),
    ),
  }

  if (tx) {
    const entry = await dispatch(executeLaborHourTransaction({ tx, options: { feeMultiplier } }))
    dispatch(watchProcessingStatus({
      status: 'atomicSwapERC20.close.closing',
      blockchain: BLOCKCHAIN_LABOR_HOUR,
      entry,
    }))
  }
}

export const getSwapList = () => async (dispatch, getState) => {
  const wallet = getMainLaborHourWallet(getState())
  const [{ data: MtS }, { data: StM }] = await Promise.all([
    SidechainMiddlewareService.getSwapListFromMainnetToSidechainByAddress(wallet.address),
    SidechainMiddlewareService.getSwapListFromSidechainToMainnetByAddress(wallet.address),
  ])
  const filter = (type) => (accumulator, swap) => {
    return swap.isActive
      ? {
        ...accumulator,
        [swap.swapId]: {
          type,
          ...swap,
        },
      }
      : accumulator
  }

  const swapList = {
    ...MtS.reduce(filter(1), {}), // 1 for swaps from mainnet to sidecain
    ...StM.reduce(filter(2), {}), // 2 for swaps from sidechain to mainnet
  }

  dispatch(LXSidechainActions.swapListUpdate(swapList))
  return swapList
}

export const obtainAllMainnetOpenSwaps = () => async (dispatch, getState) => {
  const swaps = getLXSwapsMtS(getState())
  const promises = []
  Object.values(swaps).forEach((swap) => {
    if (swap.isActive) {
      swap.isActive = false
      dispatch(LXSidechainActions.swapUpdate(swap))
      promises.push(dispatch(obtainSwapByMiddlewareFromMainnetToSidechain(swap.swapId)))
    }
  })
  const results = await Promise.all(promises)

  results.forEach(async ({ data, swapId }) => {
    if (data) {
      dispatch(closeSwap(data, swapId))
    }
  })
}

export const fixTokensToMining = () => (dispatch, getState) => {
  const lhtWallet = getMainLaborHourWallet(getState())
  const balance = lhtWallet.balances[TIME]

  if (balance.gt(0)) {
    return dispatch(depositInSidechain())
  }

  const deposit = getLXDeposit(lhtWallet.address)(getState())
  const { isCustomNode, delegateAddress } = getMiningParams(getState())

  if (deposit.gt(0) && isCustomNode) {
    const feeMultiplier = getMiningFeeMultiplier(getState())
    dispatch(startMiningInCustomNode(delegateAddress, feeMultiplier))
  }
}
