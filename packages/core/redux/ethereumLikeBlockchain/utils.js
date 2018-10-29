/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import BigNumber from 'bignumber.js'
import uuid from 'uuid/v1'

import { TxEntryModel, TxExecModel } from '../../models'

export const createTxEntryModel = (tx, options) =>
  new TxEntryModel({
    key: uuid(),
    tx,
    receipt: null,
    isSubmitted: true,
    isAccepted: false,
    walletDerivedPath: options && options.walletDerivedPath,
  })

export const createTxExecModel = (tx, gasLimit, gasPrice, nonce, chainId) => {
  const data = tx.data != null
    ? tx.data
    : null

  return new TxExecModel({
    ...tx,
    hash: null,
    data,
    block: null,
    from: tx.from.toLowerCase(),
    to: tx.to.toLowerCase(),
    gasLimit: new BigNumber(gasLimit),
    gasPrice,
    nonce,
    chainId,
  })
}

export const estimateTxGas = (web3, query) => web3.eth.estimateGas(query)
