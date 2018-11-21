/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { TIME } from '@chronobank/core/dao/constants'
import { LABOR_HOUR_NETWORK_CONFIG } from '@chronobank/login/network/settings'
import web3Factory from '../../../web3'
import { executeLaborHourTransaction } from './transactions'
import { daoByType, getMainLaborHourWallet, getLXToken, getLXDeposit, getMiningParams, getLXLockedDeposit } from '../selectors/mainSelectors'
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
  dispatch(updateMiningNodeType({ delegateAddress }))
  const state = getState()
  const dao = daoByType('TimeHolderSidechain')(state)
  const web3 = web3Factory(LABOR_HOUR_NETWORK_CONFIG)
  const wallet = getMainLaborHourWallet(state)
  const timeToken = getLXToken(TIME)(state)
  const deposit = getLXDeposit(wallet.address)(state)
  const [chainId, nonce] = await Promise.all([
    web3.eth.net.getId(),
    web3.eth.getTransactionCount(wallet.address, 'pending'),
  ])

  // timeHolder#lockDepositAndBecomeMiner
  const tx = {
    ...dao.lockDepositAndBecomeMiner(timeToken.address(), deposit, delegateAddress),
    gas: 5700000, // TODO @Abdulov remove hard code and do something
    gasPrice: 80000000000,
    nonce: nonce,
    chainId: chainId,
  }
  dispatch(executeLaborHourTransaction({ tx }))
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
