/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { TIME } from '@chronobank/core/dao/constants'
import { LABOR_HOUR_NETWORK_CONFIG } from '@chronobank/login/network/settings'
import web3Factory from '../../../web3'
import { executeLaborHourTransaction, updateLaborHourBalances, updateTimeHolderBalances } from './transactions'
import { daoByType, getMainLaborHourWallet, getLXToken, getLXDeposit, getMiningParams, getLXLockedDeposit } from '../selectors/mainSelectors'
import TokenModel from '../../../models/tokens/TokenModel'
import { EVENT_RESIGN_MINER } from '../dao/TimeHolderDAO'
import { updateMiningNodeType } from '../actions'

export const depositInSidechain = () => async (dispatch, getState) => {
  const state = getState()
  const timeHolderDao = daoByType('TimeHolderSidechain')(state)
  const timeDao = daoByType(TIME)(state)
  const web3 = web3Factory(LABOR_HOUR_NETWORK_CONFIG)
  const wallet = getMainLaborHourWallet(state)

  const [chainId, nonce] = await Promise.all([
    web3.eth.net.getId(),
    web3.eth.getTransactionCount(wallet.address, 'pending'),
  ])

  // timeHolder#deposit
  const tx = {
    ...timeDao.transfer(
      wallet.address,
      timeHolderDao.address,
      wallet.balances[TIME],
    ),
    gas: 5700000, // TODO @Abdulov remove hard code and do something
    gasPrice: 80000000000,
    nonce: nonce,
    chainId: chainId,
  }
  dispatch(executeLaborHourTransaction({ tx }))
}

export const startMiningInCustomNode = (delegateAddress) => async (dispatch, getState) => {

  dispatch(updateMiningNodeType({ isCustomNode: true, delegateAddress }))

  const state = getState()
  const timeHolderSidechainDAO = daoByType('TimeHolderSidechain')(state)
  const web3 = web3Factory(LABOR_HOUR_NETWORK_CONFIG)
  const wallet = getMainLaborHourWallet(state)
  const timeToken = getLXToken(TIME)(state)
  const lxLockedDeposit = getLXLockedDeposit(wallet.address)(state)

  const startMining = async () => {
    const lxDeposit = getLXDeposit(wallet.address)(getState())
    const [chainId, nonce] = await Promise.all([
      web3.eth.net.getId(),
      web3.eth.getTransactionCount(wallet.address, 'pending'),
    ])
    // timeHolder#lockDepositAndBecomeMiner
    const tx = {
      ...timeHolderSidechainDAO.lockDepositAndBecomeMiner(timeToken.address(), lxDeposit, delegateAddress),
      gas: 5700000, // TODO @Abdulov remove hard code and do something
      gasPrice: 80000000000,
      nonce: nonce,
      chainId: chainId,
    }
    dispatch(executeLaborHourTransaction({ tx }))
  }

  if (lxLockedDeposit.gt(0)) {
    dispatch(unlockLockedDeposit())
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
  const { isCustomNode, delegateAddress } = getMiningParams(getState())
  if (isCustomNode && delegateAddress && deposit.gt(0)) {
    dispatch(startMiningInCustomNode(delegateAddress))
  }
}

export const unlockLockedDeposit = (token: TokenModel) => async (dispatch, getState) => {
  if (!token || (token && !token.address())) {
    token = getLXToken(TIME)(getState())
  }

  const lhthWallet = getMainLaborHourWallet(getState())
  const web3 = web3Factory(LABOR_HOUR_NETWORK_CONFIG)
  const timeHolderDAO = daoByType('TimeHolderSidechain')(getState())
  const promises = [
    web3.eth.net.getId(),
    web3.eth.getTransactionCount(lhthWallet.address, 'pending'),
  ]
  const [chainId, nonce] = await Promise.all(promises)

  const tx = {
    ...timeHolderDAO.unlockDepositAndResignMiner(token.address()),
    gas: 5700000, // TODO @Abdulov remove hard code and do something
    gasPrice: 80000000000,
    nonce: nonce,
    chainId: chainId,
  }

  dispatch(executeLaborHourTransaction({ tx }))
}
