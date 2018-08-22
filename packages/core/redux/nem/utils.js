/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import uuid from 'uuid/v1'
import BigNumber from 'bignumber.js'
import { TxEntryModel, TxExecModel } from '../../models'
import nem from 'nem-sdk'

export const DECIMALS = 1000000

export const createNemTxEntryModel = (tx, options) =>
  new TxEntryModel({
    key: uuid(),
    tx,
    receipt: null,
    isSubmitted: true,
    isAccepted: false,
    walletDerivedPath: options && options.walletDerivedPath,
  })

export const describeXemTransaction = (tx, networkId) => {
  const value = tx.amount.div(DECIMALS).toNumber() // NEM-SDK works with Number data type
  const common = nem.model.objects.get("common")
  const transferTransaction = nem.model.objects.create("transferTransaction")(
    tx.to,
    value,
    'Tx from ChronoMint',
  )

  const transactionEntity = nem.model.transactions.prepare("transferTransaction")(common, transferTransaction, networkId)
  return new TxExecModel({
    tx: transactionEntity,
    hash: null,
    block: null,
    from: tx.from,
    to: tx.to,
  })
}

export const createXemTransaction = (to, amount: BigNumber, networkId) => {
  const transactionEntity = describeXemTransaction(to, amount, networkId)
  const serialized = nem.utils.serialization.serializeTransaction(transactionEntity)
  const signature = this._wallet.sign(serialized)
  return {
    tx: {
      address: this._wallet.getAddress(),
      data: nem.utils.convert.ua2hex(serialized),
      signature: signature.toString(),
    },
    fee: transactionEntity.fee,
  }
}

export const describeMosaicTransaction = (to, amount: BigNumber, mosaicDefinition) => {
  const value = amount.toNumber() // NEM-SDK works with Number data type
  const common = nem.model.objects.get("common")
  common.privateKey = this._wallet.getPrivateKey()
  const transferTransaction = nem.model.objects.create("transferTransaction")(
    to,
    1, // works as a multiplier
    'Tx from ChronoMint',
  )

  const mosaicAttachment = nem.model.objects.create("mosaicAttachment")(mosaicDefinition.id.namespaceId, mosaicDefinition.id.name, value)
  transferTransaction.mosaics.push(mosaicAttachment)

  const transactionEntity = nem.model.transactions.prepare("mosaicTransferTransaction")(common, transferTransaction, {
    [`${mosaicDefinition.id.namespaceId}:${mosaicDefinition.id.name}`]: {
      mosaicDefinition,
    },
  }, this._network.id)
  return transactionEntity
}

export const createMosaicTransaction = (to, amount: BigNumber, mosaicDefinition) => {
  const transactionEntity = describeMosaicTransaction(to, amount, mosaicDefinition)
  const serialized = nem.utils.serialization.serializeTransaction(transactionEntity)
  const signature = this._wallet.sign(serialized)
  return {
    tx: {
      address: this._wallet.getAddress(),
      data: nem.utils.convert.ua2hex(serialized),
      signature: signature.toString(),
    },
    fee: transactionEntity.fee,
  }
}
