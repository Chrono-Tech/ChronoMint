import type BigNumber from 'bignumber.js'
// TODO @ipavlenko: Fork and fix "Critical dependency: the request of a dependency is an expression": https://github.com/QuantumMechanics/NEM-sdk/issues/21
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

  createTransaction (to, amount: BigNumber/*, feeRate*/) {
    const common = nem.model.objects.get("common")
    common.privateKey = this._wallet.getPrivateKey()
    const transferTransaction = nem.model.objects.create("transferTransaction")(
      to,
      // nem-sdk have primitive API, sorry
      amount.div(DECIMALS).toNumber(),
      'Hello from ChronoMint'
    )
    const transactionEntity = nem.model.transactions.prepare("transferTransaction")(common, transferTransaction, this._network.id)

    const serialized = nem.utils.serialization.serializeTransaction(transactionEntity)
    const signature = this._wallet.sign(serialized)
    return {
      tx: {
        data: nem.utils.convert.ua2hex(serialized),
        signature: signature.toString(),
      },
      fee: transactionEntity.fee,
    }
  }
}
