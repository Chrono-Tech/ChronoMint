/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { TIME } from '@chronobank/core/dao/constants'
import {
  executeLaborHourTransaction,
  updateLaborHourBalances,
  updateTimeHolderBalances,
} from './transactions'
import {
  daoByType,
  getMainLaborHourWallet,
  getLXToken,
  getLXDeposit,
  getMiningParams,
  getLXLockedDeposit,
  getMiningFeeMultiplier,
} from '../selectors'
import TokenModel from '../../../models/tokens/TokenModel'
import { EVENT_BECOME_MINER, EVENT_RESIGN_MINER } from '../dao/TimeHolderDAO'
import { updateMiningFeeMultiplier, updateMiningNodeType, updateProcessingStatus } from '../actions'
import { watchProcessingStatus } from './utilsThunks'
import { BLOCKCHAIN_LABOR_HOUR } from '../../../dao/constants'

export const depositInSidechain = () => async (dispatch, getState) => {
  const state = getState()
  const timeHolderDao = daoByType('TimeHolderSidechain')(state)
  const timeDao = daoByType(TIME)(state)
  const wallet = getMainLaborHourWallet(state)
  const feeMultiplier = getMiningFeeMultiplier(state)

  // timeHolder#deposit
  const tx = timeDao.transfer(
    wallet.address,
    timeHolderDao.address,
    wallet.balances[TIME],
  )

  if (tx) {
    const entry = await dispatch(executeLaborHourTransaction({ tx, options: { feeMultiplier } }))
    dispatch(watchProcessingStatus({
      status: 'timeHolder.deposit.depositing',
      blockchain: BLOCKCHAIN_LABOR_HOUR,
      entry,
    }))
  }
}

export const startMiningInCustomNode = (delegateAddress, feeMultiplier) => async (dispatch, getState) => {

  dispatch(updateMiningNodeType({ isCustomNode: true, delegateAddress }))
  dispatch(updateMiningFeeMultiplier(feeMultiplier))

  const state = getState()
  const timeHolderSidechainDAO = daoByType('TimeHolderSidechain')(state)
  const wallet = getMainLaborHourWallet(state)
  const timeToken = getLXToken(TIME)(state)
  const lxLockedDeposit = getLXLockedDeposit(wallet.address)(state)

  const startMining = async () => {
    const lxDeposit = getLXDeposit(wallet.address)(getState())
    // timeHolder#lockDepositAndBecomeMiner
    const tx = timeHolderSidechainDAO.lockDepositAndBecomeMiner(timeToken.address(), lxDeposit, delegateAddress)

    if (tx) {
      const entry = await dispatch(executeLaborHourTransaction({ tx, options: { feeMultiplier } }))
      timeHolderSidechainDAO.once(EVENT_BECOME_MINER, () => {
        dispatch(updateProcessingStatus(null))
      })
      dispatch(watchProcessingStatus({
        status: 'timeHolder.becomeMiner.locking',
        blockchain: BLOCKCHAIN_LABOR_HOUR,
        entry,
      }))
    }
  }

  if (lxLockedDeposit.gt(0)) {
    dispatch(unlockLockedDeposit(timeToken, feeMultiplier))
    timeHolderSidechainDAO.once(EVENT_RESIGN_MINER, async () => {
      await Promise.all([
        dispatch(updateLaborHourBalances()),
        dispatch(updateTimeHolderBalances()),
      ])
      await startMining()
    })
  } else {
    await startMining()
  }

}

export const checkDepositBalanceAndStartMiningInCustomNode = () => (dispatch, getState) => {
  const state = getState()
  const wallet = getMainLaborHourWallet(state)
  const deposit = getLXDeposit(wallet.address)(state)
  const feeMultiplier = getMiningFeeMultiplier(getState())

  const { isCustomNode, delegateAddress } = getMiningParams(getState())
  if (isCustomNode && delegateAddress && deposit.gt(0)) {
    dispatch(startMiningInCustomNode(delegateAddress, feeMultiplier))
  } else {
    dispatch(updateProcessingStatus(null))
  }
}

export const unlockLockedDeposit = (token: TokenModel, feeMultiplier) => async (dispatch, getState) => {
  if (!token || (token && !token.address())) {
    token = getLXToken(TIME)(getState())
  }

  dispatch(updateMiningFeeMultiplier(feeMultiplier))
  const timeHolderDAO = daoByType('TimeHolderSidechain')(getState())

  const tx = timeHolderDAO.unlockDepositAndResignMiner(token.address())
  if (tx) {
    const entry = await dispatch(executeLaborHourTransaction({ tx, options: { feeMultiplier } }))
    timeHolderDAO.once(EVENT_RESIGN_MINER, () => {
      dispatch(updateProcessingStatus(null))
    })
    dispatch(watchProcessingStatus({
      status: 'timeHolder.resignMiner.unlocking',
      blockchain: BLOCKCHAIN_LABOR_HOUR,
      entry,
    }))
  }
}
