/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import uuid from 'uuid/v1'
import BigNumber from 'bignumber.js'
import { TxEntryModel, TxExecModel } from '../../models'
import {
  TRANSACTION_TYPE_TRANSFER,
  TRANSACTION_TYPE_ISSUE,
  DEFAULT_TRANSACTION_FEE,
  DEFAULT_ISSUE_FEE,
} from './constants'
import { WAVES } from '../../dao/constants'

export const createWavesTxEntryModel = (entry, options = {}) => {
  return new TxEntryModel({
    key: uuid(),
    receipt: null,
    isSubmitted: true,
    isAccepted: false,
    walletDerivedPath: options.walletDerivedPath,
    symbol: options.symbol,
    ...entry,
  })
}

export const describeTransaction = (type, params) => {
  switch (type) {
    case TRANSACTION_TYPE_ISSUE :
      return describeIssueTransaction(params)
    case TRANSACTION_TYPE_TRANSFER :
      return describeTransferTransaction(params.to, params.amount)
    default:
      return null
  }
}

export const describeIssueTransaction = (name, description, amount, reissuable = false) => {
  return {
    name,
    description,
    quantity: amount,
    precision: 5,
    reissuable,
    fee: DEFAULT_ISSUE_FEE,
    timestamp: Date.now(),
  }
}

export const describeTransferTransaction = (to, amount) => {
  return {
    recipient: to,
    assetId: WAVES,
    amount: +amount.toString(),
    feeAssetId: WAVES,
    fee: DEFAULT_TRANSACTION_FEE,
    attachment: '',
    timestamp: Date.now(),
  }
}

export const prepareWavesTransaction = (tx, token, network) => () => {
  const options = {
    from: tx.from,
    to: tx.to,
    blockchain: token.blockchain(),
    network,
    amount: tx.value,
  }
  const prepared = describeTransaction(TRANSACTION_TYPE_TRANSFER, options)

  return new TxExecModel({
    from: tx.from,
    to: tx.to,
    amount: new BigNumber(tx.value),
    fee: new BigNumber(prepared.fee),
    prepared: prepared,
  })
}
