/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import ethereumDAO from '../../dao/EthereumDAO'
import { HolderModel } from '../../models'
import EthereumMemoryDevice from '../../services/signers/EthereumMemoryDevice'
import { daoByAddress } from '../daos/selectors'
import { getEthereumSigner } from '../persistAccount/selectors'
import {
  acceptEthereumLikeBlockchainTransaction,
  estimateEthereumLikeBlockchainGas,
  ethereumLikeBlockchainTxStatus,
  executeEthereumLikeBlockchainTransaction,
  processEthereumLikeBlockchainTransaction,
  submitEthereumLikeBlockchainTransaction,
} from '../ethereumLikeBlockchain/thunks'
import { ethWeb3Update } from './actions'
import { DUCK_ETHEREUM } from './constants'
import { ethereumPendingSelector, pendingEntrySelector, web3Selector } from './selectors'

export const initEthereum = ({ web3 }) => (dispatch) => {
  dispatch(ethWeb3Update(new HolderModel({ value: web3 })))
}

export const estimateGas = (tx, feeMultiplier = 1) => (
  estimateEthereumLikeBlockchainGas(tx, feeMultiplier, web3Selector(), DUCK_ETHEREUM)
)

export const executeTransaction = ({ tx, options }) => (
  executeEthereumLikeBlockchainTransaction({ tx, options }, web3Selector(), DUCK_ETHEREUM, submitTransaction)
)

const acceptTransaction = (entry) => (
  acceptEthereumLikeBlockchainTransaction(entry, getEthereumSigner, EthereumMemoryDevice.getDerivedWallet,
    web3Selector(), pendingEntrySelector, ethTxStatus, processTransaction)
)

const ethTxStatus = (key, address, props) => (
  ethereumLikeBlockchainTxStatus(ethereumPendingSelector, key, address, props)
)

const processTransaction = ({ web3, entry, signer }) => (
  processEthereumLikeBlockchainTransaction({ web3, entry, signer }, ethTxStatus, pendingEntrySelector)
)

const submitTransaction = (entry) => (
  submitEthereumLikeBlockchainTransaction(entry, (entry, state) => daoByAddress(entry.tx.to)(state) || ethereumDAO,
    acceptTransaction, ethTxStatus)
)
