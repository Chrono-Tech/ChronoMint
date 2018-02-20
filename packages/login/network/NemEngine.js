import type BigNumber from 'bignumber.js'
import nem from 'nem-sdk'

export const DECIMALS = 1000000

export class NemEngine {
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

  createTransaction (to, amount: BigNumber, mosaicDefinition = null, feeMultiplier) {
    return mosaicDefinition
      ? this._createMosaicTransaction(to, amount, mosaicDefinition, feeMultiplier)
      : this._createXemTransaction(to, amount, feeMultiplier)
  }

  _createXemTransaction (to, amount: BigNumber, feeMultiplier) {
    const value = amount.div(DECIMALS).toNumber() // NEM-SDK works with Number data type
    const common = nem.model.objects.get("common")
    common.privateKey = this._wallet.getPrivateKey()
    const transferTransaction = nem.model.objects.create("transferTransaction")(
      to,
      value,
      'Tx from ChronoMint',
    )

    const transactionEntity = nem.model.transactions.prepare("transferTransaction")(common, transferTransaction, this._network.id)

    transactionEntity.fee = transactionEntity.fee * feeMultiplier

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

  _createMosaicTransaction (to, amount: BigNumber, mosaicDefinition, feeMultiplier) {
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

    transactionEntity.fee = transactionEntity.fee * feeMultiplier

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
