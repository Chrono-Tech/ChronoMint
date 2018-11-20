/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { LABOR_HOUR_NETWORK_CONFIG } from '@chronobank/login/network/settings'
import web3Factory from '../../../web3'
import { daoByType, getMainLaborHourWallet, getLXSwaps } from '../selectors/mainSelectors'
import web3Converter from '../../../utils/Web3Converter'
import SidechainMiddlewareService from '../SidechainMiddlewareService'
import { getEthereumSigner } from '../../persistAccount/selectors'
import { getMainEthWallet } from '../../wallets/selectors/models'
import { notifyUnknownError } from './utilsThunks'
import { executeLaborHourTransaction } from './transactions'
import * as LXSidechainActions from '../actions'

export const obtainSwapByMiddlewareFromMainnetToSidechain = (swapId) => async (
  dispatch,
  getState
) => {
  try {
    const signer = getEthereumSigner(getState())
    const {
      data,
    } = await SidechainMiddlewareService.obtainSwapFromMainnetToSidechain(
      swapId,
      signer.getPublicKey()
    )
    return Promise.resolve({ e: null, data, swapId })
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e)
    dispatch(notifyUnknownError())
    return Promise.resolve({ e, swapId })
  }
}

export const closeSwap = (encodedKey, swapId, index) => async (
  dispatch,
  getState
) => {
  const dao = daoByType('AtomicSwapERC20')(getState())
  const web3 = web3Factory(LABOR_HOUR_NETWORK_CONFIG)
  const mainEthWallet = getMainEthWallet(getState())
  const signer = getEthereumSigner(getState())

  const promises = [
    web3.eth.net.getId(),
    web3.eth.getTransactionCount(mainEthWallet.address, 'pending'),
    signer.decryptWithPrivateKey(encodedKey),
  ]
  const [chainId, nonce, key] = await Promise.all(promises)

  const tx = {
    ...dao.close(
      web3Converter.stringToBytes(swapId),
      web3Converter.stringToBytes(key)
    ),
    gas: 5700000, // TODO @Abdulov remove hard code and do something
    gasPrice: 80000000000,
    nonce: nonce + (index || 0), // increase nonce because transactions send at the same time
    chainId: chainId,
  }

  dispatch(executeLaborHourTransaction({ tx }))
}

export const getSwapList = () => async (dispatch, getState) => {
  const wallet = getMainLaborHourWallet(getState())
  const {
    data,
  } = await SidechainMiddlewareService.getSwapListFromMainnetToSidechainByAddress(
    wallet.address
  )
  // useless
  // data.forEach((swap) => {
  //   if (swap.isActive) {
  //     dispatch(LXSidechainActions.swapUpdate(swap))
  //   }
  // })
  return data
}

export const obtainAllOpenSwaps = () => async (dispatch, getState) => {
  const swaps = getLXSwaps(getState())
  const promises = []
  // promises.push(dispatch(obtainSwapByMiddlewareFromMainnetToSidechain(data[0].swapId)))
  Object.values(swaps).forEach((swap) => {
    if (swap.isActive) {
      swap.isActive = false
      // dispatch(LXSidechainActions.swapUpdate(swap))
      promises.push(dispatch(obtainSwapByMiddlewareFromMainnetToSidechain(swap.swapId)))
    }
  })
  const results = await Promise.all(promises)

  results.forEach(async ({ data, swapId }, i) => {
    if (data) {
      dispatch(closeSwap(data, swapId, i))
    }
  })
}
