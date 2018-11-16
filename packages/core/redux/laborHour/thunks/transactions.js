/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { getLaborHourWeb3 } from '@chronobank/login/network/LaborHourProvider'
import { TIME } from '@chronobank/login/network/constants'
import {
  web3Selector,
  getMainLaborHourWallet,
  daoByType,
  getLXToken, getLXTokens,
} from '../selectors/mainSelectors'
import laborHourDAO from '../../../dao/LaborHourDAO'
import TransactionHandler from '../../abstractEthereum/utils/TransactionHandler'
import { BLOCKCHAIN_LABOR_HOUR } from '../../../dao/constants'
import * as LXSidechainActions from '../actions'
import { WalletModel, Amount } from '../../../models'

class LaborHourTransactionHandler extends TransactionHandler {
  constructor () {
    super(BLOCKCHAIN_LABOR_HOUR)
    this.web3 = null
  }

  getDAO () {
    return laborHourDAO
  }

  getWeb3 (state) {
    if (this.web3 === null) {
      this.web3 = getLaborHourWeb3(web3Selector()(state))
    }

    return this.web3
  }
}

const transactionHandler = new LaborHourTransactionHandler()
export const estimateLaborHourGas = (tx, feeMultiplier = 1) => transactionHandler.estimateGas(tx, feeMultiplier)
export const executeLaborHourTransaction = ({ tx, options }) => transactionHandler.executeTransaction({ tx, options })

export const getTokenBalance = (tokenDao) => async (dispatch, getState) => {
  const wallet = getMainLaborHourWallet(getState())
  const balance = await tokenDao.getAccountBalance(wallet.address)
  const token = tokenDao.token

  dispatch(
    LXSidechainActions.updateWallet(
      new WalletModel({
        ...wallet,
        balances: {
          ...wallet.balances,
          [token.symbol()]: new Amount(balance, token.symbol()),
        },
      }),
    ),
  )
}

export const updateLaborHourBalances = () => (dispatch, getState) => {
  const tokens = getLXTokens(getState())
  return Promise.all(tokens
    .items()
    .map((token) => {
      const tokenDao = daoByType(token.symbol())(getState())
      return dispatch(getTokenBalance(tokenDao))
    }))
}

export const updateTimeHolderBalances = () => async (dispatch, getState) => {
  const timeHolderDao = daoByType('TimeHolderSidechain')(getState())
  const wallet = getMainLaborHourWallet(getState())
  const timeToken = getLXToken(TIME)(getState())

  const depositBalance = await timeHolderDao.getDepositBalance(timeToken.address(), wallet.address)
  // TODO @abdulov remove console.log
  console.log('%c depositBalance', 'background: #222; color: #fff', depositBalance)
  dispatch(LXSidechainActions.updateDeposit(wallet.address, new Amount(depositBalance, timeToken.symbol())))

  const lockedDepositBalance = await timeHolderDao.getLockedDepositBalance(timeToken.address(), wallet.address)
  // TODO @abdulov remove console.log
  console.log('%c lockedDepositBalance', 'background: #222; color: #fff', lockedDepositBalance)
  dispatch(LXSidechainActions.updateLockedDeposit(wallet.address, new Amount(lockedDepositBalance, timeToken.symbol())))
}
