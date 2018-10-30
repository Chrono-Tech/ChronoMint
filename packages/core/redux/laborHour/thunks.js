/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { getLaborHourWeb3 } from '@chronobank/login/network/LaborHourProvider'

import { HolderModel } from '../../models'
import { BLOCKCHAIN_LABOR_HOUR } from '../../dao/constants'
import laborHourDAO from '../../dao/LaborHourDAO'
import LaborHourMemoryDevice from '../../services/signers/LaborHourMemoryDevice'
import TransactionHandler from '../ethereumTransaction/utils/TransactionHandler'
import { laborHourWeb3Update } from './actions'
import { getLaborHourSigner, web3Selector } from './selectors'

class LaborHourTransactionHandler extends TransactionHandler {
  constructor () {
    super(BLOCKCHAIN_LABOR_HOUR, getLaborHourSigner, LaborHourMemoryDevice.getDerivedWallet)
    this.web3 = null
  }

  getDAO () {
    return laborHourDAO
  }

  getWeb3 (state) {
    if(this.web3 === null) {
      this.web3 = getLaborHourWeb3(web3Selector()(state))
    }

    return this.web3
  }
}

const transactionHandler = new LaborHourTransactionHandler()
export const estimateLaborHourGas = (tx, feeMultiplier = 1) => transactionHandler.estimateGas(tx, feeMultiplier)
export const executeLaborHourTransaction = ({ tx, options }) => transactionHandler.executeTransaction({ tx, options })
export const initLaborHour = ({ web3 }) => (dispatch) => dispatch(laborHourWeb3Update(new HolderModel({ value: web3 })))
