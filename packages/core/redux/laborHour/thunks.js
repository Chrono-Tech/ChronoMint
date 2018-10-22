/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { getLaborHourWeb3 } from '@chronobank/login/network/LhtProvider'
import { LABOR_HOUR_WSS } from '@chronobank/login/network/settings'

import laborHourDAO from '../../dao/LaborHourTokenDAO'
import LaborHourMemoryDevice from '../../services/signers/LaborHourMemoryDevice'
import {
  acceptEthereumLikeBlockchainTransaction,
  ethereumLikeBlockchainTxStatus,
  executeEthereumLikeBlockchainTransaction,
  processEthereumLikeBlockchainTransaction,
  submitEthereumLikeBlockchainTransaction,
} from '../ethereumLikeBlockchain/thunks'
import { getEstimateGasRequestBasicFieldSet } from '../ethereumLikeBlockchain/utils'
import { DUCK_LABOR_HOUR } from './constants'
import { getLaborHourSigner, laborHourPendingSelector, laborHourPendingEntrySelector } from './selectors'

export const executeLaborHourTransaction = ({ tx, options }) => (
  executeEthereumLikeBlockchainTransaction({ tx, options }, () => getLaborHourWeb3(LABOR_HOUR_WSS), DUCK_LABOR_HOUR,
    getEstimateGasRequestBasicFieldSet, submitTransaction)
)

const acceptTransaction = (entry) => (
  acceptEthereumLikeBlockchainTransaction(entry, getLaborHourSigner, LaborHourMemoryDevice.getDerivedWallet,
    () => getLaborHourWeb3(LABOR_HOUR_WSS), laborHourPendingEntrySelector, laborHourTxStatus, processTransaction)
)

const laborHourTxStatus = (key, address, props) => (
  ethereumLikeBlockchainTxStatus(laborHourPendingSelector, key, address, props)
)

export const processTransaction = ({ web3, entry, signer }) => (
  processEthereumLikeBlockchainTransaction({ web3, entry, signer }, laborHourTxStatus, laborHourPendingEntrySelector)
)

export const submitTransaction = (entry) => (
  submitEthereumLikeBlockchainTransaction(entry, () => laborHourDAO, acceptTransaction, laborHourTxStatus)
)
