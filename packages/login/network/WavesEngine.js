/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import type BigNumber from 'bignumber.js'
import waves from 'waves-api'

export const DECIMALS = 1000000

export class WavesEngine {
  constructor (wallet, network) {
    this._wallet = wallet
    this._network = network
  }

  getNetwork () {
    return this._network
  }

  getAddress () {
    return this._wallet.getAddress()
  }

  getPrivateKey () {
    return this._wallet.getPrivateKey()
  }

  // eslint-disable-next-line
  describeTransaction (to, amount: BigNumber, mosaicDefinition = null) {
    return mosaicDefinition
      ? this._describeMosaicTransaction(to, amount, mosaicDefinition)
      : this._describeWavesTransaction(to, amount)
    // return { fee: 0.1 * DECIMALS }
  }

  createTransaction (to, amount: BigNumber, mosaicDefinition = null) {
    return mosaicDefinition
      ? this._createMosaicTransaction(to, amount, mosaicDefinition)
      : this._createWavesTransaction(to, amount)
  }

  _describeWavesTransaction (to, amount: BigNumber) {
    const value = amount.div(DECIMALS).toNumber() // NEM-SDK works with Number data type
    const common = nem.model.objects.get("common")
    common.privateKey = this._wallet.getPrivateKey()
    const transferTransaction = nem.model.objects.create("transferTransaction")(
      to,
      value,
      'Tx from ChronoMint',
    )

    const transactionEntity = nem.model.transactions.prepare("transferTransaction")(common, transferTransaction, this._network.id)
    return transactionEntity
  }

  _createWavesTransaction (to, amount: BigNumber) {
    const transactionEntity = this._describeWavesTransaction(to, amount)
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

  _describeMosaicTransaction (to, amount: BigNumber, mosaicDefinition) {
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
      [ `${mosaicDefinition.id.namespaceId}:${mosaicDefinition.id.name}` ]: {
        mosaicDefinition,
      },
    }, this._network.id)
    return transactionEntity
  }

  _createMosaicTransaction (to, amount: BigNumber, mosaicDefinition) {
    const transactionEntity = this._describeMosaicTransaction(to, amount, mosaicDefinition)
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
}
