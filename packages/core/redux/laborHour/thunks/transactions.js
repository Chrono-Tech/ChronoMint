/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { getLaborHourWeb3 } from '@chronobank/login/network/LaborHourProvider'
import { web3Selector } from '../selectors/mainSelectors'
import laborHourDAO from '../../../dao/LaborHourDAO'
import TransactionHandler from '../../abstractEthereum/utils/TransactionHandler'
import { BLOCKCHAIN_LABOR_HOUR } from '../../../dao/constants'

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
