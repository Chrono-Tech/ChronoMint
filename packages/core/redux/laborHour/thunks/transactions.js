/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { getLaborHourWeb3 } from '@chronobank/login/network/LaborHourProvider'
import { web3Selector, getMainLaborHourWallet } from '../selectors/mainSelectors'
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

  // TODO @abdulov remove console.log
  console.log(
    '%c balance',
    'background: #222; color: #fff',
    wallet.address,
    token.removeDecimals(balance).toString(),
    token.symbol(),
  )
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
