/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

//#region imports
import {
  daoByType,
  getLXLockedDeposit, getLXSwapsStM,
  getMainLaborHourWallet, getMiningFeeMultiplier,
} from '../selectors/mainSelectors'
import { daoByType as daoByTypeMainnet } from '../../daos/selectors'
import Amount from '../../../models/Amount'
import web3Converter from '../../../utils/Web3Converter'
import TokenModel from '../../../models/tokens/TokenModel'
import SidechainMiddlewareService from '../SidechainMiddlewareService'
import { getEthereumSigner } from '../../persistAccount/selectors'
import { executeTransaction } from '../../ethereum/thunks'
import { executeLaborHourTransaction } from './transactions'
import { swapUpdate, updateMiningFeeMultiplier, updateMiningNodeType } from '../actions'
import { notifyUnknownError } from './utilsThunks'
import { EVENT_RESIGN_MINER } from '../dao/TimeHolderDAO'
import { unlockLockedDeposit } from './mining'
import { watchProcessingStatus } from './utilsThunks'
import { BLOCKCHAIN_ETHEREUM, BLOCKCHAIN_LABOR_HOUR } from '../../../dao/constants'
//#endregion

export const sidechainWithdraw = (
  amount: Amount,
  token: TokenModel,
  isCustomNode,
  delegateAddress,
  feeMultiplier,
) => async (dispatch, getState) => {

  try {
    dispatch(updateMiningNodeType({ isCustomNode, delegateAddress }))
    dispatch(updateMiningFeeMultiplier(feeMultiplier))
    const timeHolderDAO = daoByType('TimeHolderSidechain')(getState())
    const lhthWallet = getMainLaborHourWallet(getState())
    const lockedDeposit = getLXLockedDeposit(lhthWallet.address)(getState())

    const withdraw = async () => {
      const tx = timeHolderDAO.withdrawShares(token.address(), amount)
      if (tx) {
        const entry = await dispatch(executeLaborHourTransaction({ tx, options: { feeMultiplier } }))
        dispatch(watchProcessingStatus({
          status: 'timeHolder.withdrawShares.withdrawing',
          blockchain: BLOCKCHAIN_LABOR_HOUR,
          entry,
        }))
      }
    }

    if (lockedDeposit.gt(0)) {
      dispatch(unlockLockedDeposit(token, feeMultiplier))
      timeHolderDAO.once(EVENT_RESIGN_MINER, () => {
        withdraw()
      })
    } else {
      withdraw()
    }
  } catch (e) {
    // eslint-disable-next-line
    console.error('deposit error', e)
  }
}

export const obtainSwapByMiddlewareFromSidechainToMainnet = (swapId) => async (
  dispatch,
  getState,
) => {
  try {
    const signer = getEthereumSigner(getState())
    const {
      data,
    } = await SidechainMiddlewareService.obtainSwapFromSidechainToMainnet(
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

export const unlockShares = (swapId, encodedKey) => async (
  dispatch,
  getState,
) => {
  try {
    const timeHolderDAO = daoByTypeMainnet('TimeHolder')(getState())
    const signer = getEthereumSigner(getState())
    const key = await signer.decryptWithPrivateKey(encodedKey)
    const feeMultiplier = getMiningFeeMultiplier(getState())
    const tx = timeHolderDAO.unlockShares(
      web3Converter.stringToBytes(swapId),
      web3Converter.stringToBytes(key),
    )

    if (tx) {
      const entry = await dispatch(executeTransaction({ tx, options: { feeMultiplier } }))
      dispatch(watchProcessingStatus({
        status: 'assetsHolder.unlocking',
        blockchain: BLOCKCHAIN_ETHEREUM,
        entry,
      }))
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e)
    dispatch(notifyUnknownError())
  }
}

export const obtainAllLXOpenSwaps = () => async (dispatch, getState) => {
  const swaps = getLXSwapsStM(getState())
  const promises = []
  Object.values(swaps).slice(0, -10).forEach((swap) => {
    if (swap.isActive) {
      swap.isActive = false
      dispatch(swapUpdate(swap))
      promises.push(dispatch(obtainSwapByMiddlewareFromSidechainToMainnet(swap.swapId)))
    }
  })
  const results = await Promise.all(promises)

  results.forEach(async ({ data, swapId }) => {
    if (data) {
      dispatch(unlockShares(swapId, data))
    }
  })
}
