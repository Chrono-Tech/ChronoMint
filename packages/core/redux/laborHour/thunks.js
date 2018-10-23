/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { getLaborHourWeb3 } from '@chronobank/login/network/LaborHourProvider'
import { LABOR_HOUR_WSS } from '@chronobank/login/network/settings'

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
import { DUCK_LABOR_HOUR } from './constants'
import { getLaborHourSigner, laborHourPendingSelector, laborHourPendingEntrySelector } from './selectors'

export const estimateLaborHourGas = (tx, feeMultiplier = 1) => (
  estimateEthereumLikeBlockchainGas(tx, feeMultiplier, getWeb3, DUCK_LABOR_HOUR, getEstimateGasRequestBasicFieldSet)
)

export const executeLaborHourTransaction = ({ tx, options }) => (
  executeEthereumLikeBlockchainTransaction({ tx, options }, getWeb3, DUCK_LABOR_HOUR,
    getEstimateGasRequestBasicFieldSet, submitTransaction)
)

const acceptTransaction = (entry) => (
  acceptEthereumLikeBlockchainTransaction(entry, getLaborHourSigner, LaborHourMemoryDevice.getDerivedWallet,
    getWeb3, laborHourPendingEntrySelector, laborHourTxStatus, processTransaction)
)

const getWeb3 = () => getLaborHourWeb3(LABOR_HOUR_WSS)

const laborHourTxStatus = (key, address, props) => (
  ethereumLikeBlockchainTxStatus(laborHourPendingSelector, key, address, props)
)

const processTransaction = ({ web3, entry, signer }) => (
  processEthereumLikeBlockchainTransaction({ web3, entry, signer }, laborHourTxStatus, laborHourPendingEntrySelector)
)

const submitTransaction = (entry) => (
  submitEthereumLikeBlockchainTransaction(entry, () => laborHourDAO, acceptTransaction, laborHourTxStatus)
)
