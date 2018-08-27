/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import uuid from 'uuid/v1'
import NemWallet from '@chronobank/login/network/NemWallet'
import nemSdk from 'nem-sdk'
import { TxEntryModel, TxExecModel } from '../../models'

export const DECIMALS = 1000000

export const createNemTxEntryModel = (entry, options = {}) =>
  new TxEntryModel({
    key: uuid(),
    receipt: null,
    isSubmitted: true,
    isAccepted: false,
    walletDerivedPath: options && options.walletDerivedPath,
    symbol: options.symbol,
    ...entry,
  })

export const describeXemTransaction = (tx, network) => {
  const value = tx.amount.div(DECIMALS).toNumber() // NEM-SDK works with Number data type
  // Get an empty common object to hold pass and key
  const common = nemSdk.model.objects.get('common')
  const transferTransaction = nemSdk.model.objects.create('transferTransaction')(
    tx.to,
    value,
    'Tx from ChronoMint',
  )

  const nemNetwork = nemSdk.model.network.data[network.nem]
  const transactionEntity = nemSdk.model.transactions.prepare('transferTransaction')(common, transferTransaction, nemNetwork.id)
  return new TxExecModel({
    prepared: transactionEntity,
    hash: null,
    block: null,
    from: tx.from,
    to: tx.to,
  })
}

export const describeMosaicTransaction = (tx, network) => {
  const value = tx.amount.toNumber() // NEM-SDK works with Number data type
  const nemNetwork = nemSdk.model.network.data[network.nem]
  const common = nemSdk.model.objects.get('common')
  const transferTransaction = nemSdk.model.objects.create('transferTransaction')(
    tx.to,
    1, // works as a multiplier
    'Tx from ChronoMint',
  )
  const mosaicDefinition = tx.mosaicDefinition

  const mosaicAttachment = nemSdk.model.objects.create('mosaicAttachment')(mosaicDefinition.id.namespaceId, mosaicDefinition.id.name, value)
  transferTransaction.mosaics.push(mosaicAttachment)

  const transactionEntity = nemSdk.model.transactions.prepare('mosaicTransferTransaction')(common, transferTransaction, {
    [`${mosaicDefinition.id.namespaceId}:${mosaicDefinition.id.name}`]: {
      mosaicDefinition,
    },
  }, nemNetwork.id)

  return new TxExecModel({
    prepared: transactionEntity,
    hash: null,
    block: null,
    from: tx.from,
    to: tx.to,
  })
}

export const createXemTransaction = (prepared, signer, network) => {
  const pk = signer.privateKey.substring(2, 66) // remove 0x
  const menNetwork = nemSdk.model.network.data[network.nem]
  const nemWallet = NemWallet.fromPrivateKey(pk, menNetwork)
  const pubKey = nemWallet._keyPair.publicKey.toString('hex') // get public key for tx

  const serialized = nemSdk.utils.serialization.serializeTransaction({ ...prepared, signer: pubKey })
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
