/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { TIME } from '@chronobank/core/dao/constants'
import { LABOR_HOUR_NETWORK_CONFIG } from '@chronobank/login/network/settings'
import web3Factory from '../../../web3'
import { executeLaborHourTransaction } from './transactions'
import { daoByType, getMainLaborHourWallet, getLXToken, getLXDeposit } from '../selectors/mainSelectors'
import { updateMiningNodeType } from '../actions'

export const startMiningInPoll = () => async (dispatch, getState) => {
  const state = getState()
  const timeHolderDao = daoByType('TimeHolderSidechain')(state)
  const timeDao = daoByType(TIME)(state)
  const web3 = web3Factory(LABOR_HOUR_NETWORK_CONFIG)
  const wallet = getMainLaborHourWallet(state)
  const timeBalance = wallet.balances[TIME]

  const [chainId, nonce] = await Promise.all([
    web3.eth.net.getId(),
    web3.eth.getTransactionCount(wallet.address, 'pending'),
  ])

  // timeHolder#deposit
  const tx = {
    ...timeDao.transfer(wallet.address, timeHolderDao.address, timeBalance),
    // ...timeHolderDao.deposit(timeToken.address(), timeBalance),
    gas: 5700000, // TODO @Abdulov remove hard code and do something
    gasPrice: 80000000000,
    nonce: nonce,
    chainId: chainId,
  }
  dispatch(executeLaborHourTransaction({ tx }))
}

export const startMiningInCustomNode = (delegateAddress) => async (dispatch, getState) => {
  dispatch(updateMiningNodeType(true, delegateAddress))
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
