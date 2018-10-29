/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { HolderModel } from '../../models'
import laborHourDAO from '../../dao/LaborHourDAO'
import LaborHourMemoryDevice from '../../services/signers/LaborHourMemoryDevice'
import TransactionHandler from '../ethereumLikeBlockchain/utils/TransactionHandler'
import { nonceUpdate, txCreate, txUpdate, laborHourWeb3Update } from './actions'
import { DUCK_LABOR_HOUR } from './constants'
import { getLaborHourSigner, laborHourPendingSelector, laborHourPendingEntrySelector, web3Selector } from './selectors'

class LaborHourTransactionHandler extends TransactionHandler {
  constructor () {
    super(DUCK_LABOR_HOUR, laborHourPendingSelector, laborHourPendingEntrySelector, getLaborHourSigner,
      LaborHourMemoryDevice.getDerivedWallet, { nonceUpdate, txCreate, txUpdate })
  }

  getDAO () {
    return laborHourDAO
  }

  getWeb3 (state) {
    return web3Selector()(state)
  }
}

const transactionHandler = new LaborHourTransactionHandler()
export const estimateLaborHourGas = (tx, feeMultiplier = 1) => transactionHandler.estimateGas(tx, feeMultiplier)
export const executeLaborHourTransaction = ({ tx, options }) => transactionHandler.executeTransaction({ tx, options })
export const initLaborHour = ({ web3 }) => (dispatch) => dispatch(laborHourWeb3Update(new HolderModel({ value: web3 })))
