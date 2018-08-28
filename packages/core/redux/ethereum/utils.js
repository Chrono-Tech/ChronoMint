/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import uuid from 'uuid/v1'
import BigNumber from 'bignumber.js'
import { TxEntryModel, TxExecModel } from '../../models'

export const createEthTxEntryModel = (tx, options) =>
  new TxEntryModel({
    key: uuid(),
    tx,
    receipt: null,
    isSubmitted: true,
    isAccepted: false,
    walletDerivedPath: options && options.walletDerivedPath,
  })

export const createEthTxExecModel = (tx, gasLimit, gasPrice, nonce, chainId) => {
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

export const estimateEthTxGas = (web3, tx, gasPrice, nonce, chainId) =>
  web3.eth.estimateGas({
    from: tx.from,
    to: tx.to,
    gasPrice,
    value: tx.value,
    data: tx.data,
    nonce,
    chainId,
  })
