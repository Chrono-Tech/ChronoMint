/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import uuid from 'uuid/v1'
import BigNumber from 'bignumber.js'
import { TxEntryModel, TxExecModel } from '../../models'
import { TRANSACTION_TYPE_TRANSFER, TRANSACTION_TYPE_ISSUE } from './constants'

export const createWavesTxEntryModel = (entry, options = {}) => {
  return new TxEntryModel({
    key: uuid(),
    receipt: null,
    isSubmitted: true,
    isAccepted: false,
    walletDerivedPath: options && options.walletDerivedPath,
    symbol: options.symbol,
    ...entry,
  })
}

export const describeTransaction = (type, params) => {
  switch (type) {
    case TRANSACTION_TYPE_ISSUE :
      return describeIssueTransaction(params)
    case TRANSACTION_TYPE_TRANSFER :
      return describeTransferTransaction(params.to, params.amount, params.asset)
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
    fee: 100000000,
    timestamp: Date.now(),
  }
}

export const describeTransferTransaction = (to, amount, asset) => {
  return {
    senderPublicKey: this.getPublicKey(),
    recipient: to,
    assetId: asset,
    amount,
    feeAssetId: this._Waves.constants.WAVES,
    fee: 100000,
    attachment: '',
    timestamp: Date.now(),
  }
}

export const prepareWavesTransaction = (tx, token, network) => () => {
  const options = {
    from: tx.from,
    blockchain: token.blockchain(),
    network,
  }
  const prepared = describeTransaction(tx, options)

  return new TxExecModel({
    from: tx.from,
    to: tx.to,
    amount: new BigNumber(tx.value),
    fee: new BigNumber(prepared.fee),
    prepared: prepared,
  })
}
