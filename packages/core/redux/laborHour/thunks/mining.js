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
} from '../selectors/mainSelectors'
import TokenModel from '../../../models/tokens/TokenModel'
import { EVENT_RESIGN_MINER } from '../dao/TimeHolderDAO'
import { updateMiningFeeMultiplier, updateMiningNodeType } from '../actions'

export const depositInSidechain = () => async (dispatch, getState) => {
  const state = getState()
  const timeHolderDao = daoByType('TimeHolderSidechain')(state)
  const timeDao = daoByType(TIME)(state)
  const wallet = getMainLaborHourWallet(state)
  const feeMultiplier = getMiningFeeMultiplier(state)

  // timeHolder#deposit
  const tx = {
    ...timeDao.transfer(
      wallet.address,
      timeHolderDao.address,
      wallet.balances[TIME],
    ),
  }
  dispatch(executeLaborHourTransaction({ tx, options: { feeMultiplier } }))
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
    const tx = {
      ...timeHolderSidechainDAO.lockDepositAndBecomeMiner(timeToken.address(), lxDeposit, delegateAddress),
    }
    dispatch(executeLaborHourTransaction({ tx, options: { feeMultiplier } }))
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
  }
}

export const unlockLockedDeposit = (token: TokenModel, feeMultiplier) => async (dispatch, getState) => {
  if (!token || (token && !token.address())) {
    token = getLXToken(TIME)(getState())
  }

  dispatch(updateMiningFeeMultiplier(feeMultiplier))
  const timeHolderDAO = daoByType('TimeHolderSidechain')(getState())

  const tx = {
    ...timeHolderDAO.unlockDepositAndResignMiner(token.address()),
  }

  dispatch(executeLaborHourTransaction({ tx, options: { feeMultiplier } }))
}
