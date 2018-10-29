/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import ethereumDAO from '../../dao/EthereumDAO'
import { HolderModel } from '../../models'
import EthereumMemoryDevice from '../../services/signers/EthereumMemoryDevice'
import { daoByAddress } from '../daos/selectors'
import TransactionHandler from '../ethereumLikeBlockchain/utils/TransactionHandler'
import { getEthereumSigner } from '../persistAccount/selectors'
import { ethNonceUpdate, ethTxCreate, ethTxUpdate, ethWeb3Update } from './actions'
import { DUCK_ETHEREUM } from './constants'
import { ethereumPendingSelector, pendingEntrySelector, web3Selector } from './selectors'

class EthereumTransactionHandler extends TransactionHandler {
  constructor () {
    super(DUCK_ETHEREUM, ethereumPendingSelector, pendingEntrySelector, getEthereumSigner,
      EthereumMemoryDevice.getDerivedWallet, {
        nonceUpdate: ethNonceUpdate,
        txCreate: ethTxCreate,
        txUpdate: ethTxUpdate
      }
    )
  }

  getDAO (entry, state) {
    return daoByAddress(entry.tx.to)(state) || ethereumDAO
  }

  getEstimateGasRequestFieldSet (tx, gasPrice, nonce, chainId) {
    const fields = super.getEstimateGasRequestFieldSet(tx, gasPrice, nonce)
    fields.chainId = chainId
    return fields
  }

  getWeb3 (state) {
    return web3Selector()(state)
  }
}

const transactionHandler = new EthereumTransactionHandler()
export const estimateGas = (tx, feeMultiplier = 1) => transactionHandler.estimateGas(tx, feeMultiplier)
export const executeTransaction = ({ tx, options }) => transactionHandler.executeTransaction({ tx, options })

export const initEthereum = ({ web3 }) => (dispatch) => {
  dispatch(ethWeb3Update(new HolderModel({ value: web3 })))
}
