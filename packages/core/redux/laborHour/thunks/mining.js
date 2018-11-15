/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { TIME } from '@chronobank/core/dao/constants'
import { LABOR_HOUR_NETWORK_CONFIG } from '@chronobank/login/network/settings'
import web3Factory from '../../../web3'
import { executeLaborHourTransaction } from './transactions'
import { daoByType, getMainLaborHourWallet, getLXToken } from '../selectors/mainSelectors'

export const startMiningInPoll = () => async (dispatch, getState) => {
  const state = getState()
  const timeHolderDao = daoByType('TimeHolderSidechain')(state)
  const timeDao = daoByType(TIME)(state)
  const web3 = web3Factory(LABOR_HOUR_NETWORK_CONFIG)
  const wallet = getMainLaborHourWallet(state)
  const timeBalance = wallet.balances[TIME]
  const timeToken = getLXToken(TIME)(state)
  // TODO @abdulov remove console.log
  console.log('%c timeDao', 'background: #222; color: #fff', timeDao)

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

export const startMiningInCustomNode = () => async (dispatch, getState) => {
  const state = getState()
  const dao = daoByType('TimeHolderSidechain')(state)
  const web3 = web3Factory(LABOR_HOUR_NETWORK_CONFIG)
  const wallet = getMainLaborHourWallet(state)
  const timeToken = getLXToken(TIME)(state)
  const timeBalance = wallet.balances[TIME]
  const delegateAddress = ''
  // TODO @abdulov remove console.log
  console.log('%c timeToken', 'background: #222; color: #fff', timeToken.toJS())
  const [chainId, nonce] = await Promise.all([
    web3.eth.net.getId(),
    web3.eth.getTransactionCount(wallet.address, 'pending'),
  ])

  // TODO @abdulov remove console.log
  console.log('%c timeToken.address(), timeBalance', 'background: #222; color: #fff', timeToken.address(), timeBalance.toString())
  // timeHolder#lockDepositAndBecomeMiner
  const tx = {
    ...dao.lockDepositAndBecomeMiner(timeToken.address, timeBalance, delegateAddress),
    gas: 5700000, // TODO @Abdulov remove hard code and do something
    gasPrice: 80000000000,
    nonce: nonce,
    chainId: chainId,
  }
  dispatch(executeLaborHourTransaction({ tx }))
}
