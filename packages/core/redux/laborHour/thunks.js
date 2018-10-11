/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { HolderModel } from '../../models'
import laborHourDAO from '../../dao/LaborHourDAO'
import LaborHourMemoryDevice from '../../services/signers/LaborHourMemoryDevice'
import {
  acceptEthereumLikeBlockchainTransaction,
  estimateEthereumLikeBlockchainGas,
  ethereumLikeBlockchainTxStatus,
  executeEthereumLikeBlockchainTransaction,
  processEthereumLikeBlockchainTransaction,
  submitEthereumLikeBlockchainTransaction,
} from '../ethereumLikeBlockchain/thunks'
import { getEstimateGasRequestBasicFieldSet } from '../ethereumLikeBlockchain/utils'
import { laborHourWeb3Update } from './actions'
import { DUCK_ETHEREUM_LIKE_BLOCKCHAIN as DUCK_LABOR_HOUR } from '../ethereumLikeBlockchain/constants'
import { getLaborHourSigner, laborHourPendingSelector, laborHourPendingEntrySelector, web3Selector } from './selectors'

export const initLaborHour = ({ web3 }) => (dispatch) => dispatch(laborHourWeb3Update(new HolderModel({ value: web3 })))

export const estimateLaborHourGas = (tx, feeMultiplier = 1) => (
  estimateEthereumLikeBlockchainGas(tx, feeMultiplier, web3Selector(), DUCK_LABOR_HOUR, getEstimateGasRequestBasicFieldSet)
)

export const executeLaborHourTransaction = ({ tx, options }) => (
  executeEthereumLikeBlockchainTransaction({ tx, options }, web3Selector(), DUCK_LABOR_HOUR,
    getEstimateGasRequestBasicFieldSet, submitTransaction)
)

const acceptTransaction = (entry) => (
  acceptEthereumLikeBlockchainTransaction(entry, getLaborHourSigner, LaborHourMemoryDevice.getDerivedWallet,
    web3Selector(), laborHourPendingEntrySelector, laborHourTxStatus, processTransaction)
)

const laborHourTxStatus = (key, address, props) => (
  ethereumLikeBlockchainTxStatus(laborHourPendingSelector, key, address, props)
)

const processTransaction = ({ web3, entry, signer }) => (
  processEthereumLikeBlockchainTransaction({ web3, entry, signer }, laborHourTxStatus, laborHourPendingEntrySelector)
)

const submitTransaction = (entry) => (
  submitEthereumLikeBlockchainTransaction(entry, () => laborHourDAO, acceptTransaction, laborHourTxStatus)
)
