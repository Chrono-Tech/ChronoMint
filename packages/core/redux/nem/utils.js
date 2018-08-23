/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import uuid from 'uuid/v1'
import BigNumber from 'bignumber.js'
import NemWallet from '@chronobank/login/network/NemWallet'
import nemSdk from 'nem-sdk'
import { TxEntryModel, TxExecModel } from '../../models'

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

export const describeXemTransaction = (tx, networkId, pk) => {
  const value = tx.amount.div(DECIMALS).toNumber() // NEM-SDK works with Number data type
  // Get an empty common object to hold pass and key
  const common = nemSdk.model.objects.get("common")
  if (pk) {
    common.privateKey = pk
  }
  const transferTransaction = nemSdk.model.objects.create("transferTransaction")(
    tx.to,
    value,
    'Tx from ChronoMint',
  )

  const transactionEntity = nemSdk.model.transactions.prepare("transferTransaction")(common, transferTransaction, networkId)
  return new TxExecModel({
    tx: transactionEntity,
    hash: null,
    block: null,
    from: tx.from,
    to: tx.to,
  })
}

export const createXemTransaction = (prepared, signer, network) => {
  const pk = signer.privateKey.substring(2, 66) // remove 0x
  const nemWallet = NemWallet.fromPrivateKey(pk, nemSdk.model.network.data[network.nem])
  const serialized = nemSdk.utils.serialization.serializeTransaction({ ...prepared, signer: pk })
  const signature = nemWallet.sign(serialized)
  return {
    tx: {
      address: nemWallet.getAddress(),
      data: nemSdk.utils.convert.ua2hex(serialized),
      signature: signature.toString(),
    },
    fee: prepared.fee,
  }
}

export const describeMosaicTransaction = (to, amount: BigNumber, mosaicDefinition) => {
  const value = amount.toNumber() // NEM-SDK works with Number data type
  const common = nemSdk.model.objects.get("common")
  common.privateKey = this._wallet.getPrivateKey()
  const transferTransaction = nemSdk.model.objects.create("transferTransaction")(
    to,
    1, // works as a multiplier
    'Tx from ChronoMint',
  )

  const mosaicAttachment = nemSdk.model.objects.create("mosaicAttachment")(mosaicDefinition.id.namespaceId, mosaicDefinition.id.name, value)
  transferTransaction.mosaics.push(mosaicAttachment)

  const transactionEntity = nemSdk.model.transactions.prepare("mosaicTransferTransaction")(common, transferTransaction, {
    [`${mosaicDefinition.id.namespaceId}:${mosaicDefinition.id.name}`]: {
      mosaicDefinition,
    },
  }, this._network.id)
  return transactionEntity
}

export const createMosaicTransaction = (to, amount: BigNumber, mosaicDefinition) => {
  const transactionEntity = describeMosaicTransaction(to, amount, mosaicDefinition)
  const serialized = nemSdk.utils.serialization.serializeTransaction(transactionEntity)
  const signature = this._wallet.sign(serialized)
  return {
    tx: {
      address: this._wallet.getAddress(),
      data: nemSdk.utils.convert.ua2hex(serialized),
      signature: signature.toString(),
    },
    fee: transactionEntity.fee,
  }
}
