import AbstractContractDAO from './AbstractContractDAO'
import TransactionModel from '../models/TransactionModel'

export default class PlatformEmitterDAO extends AbstractContractDAO {
  constructor (at) {
    super(require('chronobank-smart-contracts/build/contracts/ChronoBankPlatformEmitter.json'), at)
  }

  /**
   * @param tx
   * @param block
   * @return {TransactionModel}
   * @private
   */
  _transformRawTx2Model (tx: Object, block: Object) {
    return new TransactionModel({
      txHash: tx.transactionHash,
      blockHash: tx.blockHash,
      blockNumber: tx.blockNumber,
      transactionIndex: tx.transactionIndex,
      from: tx.args.from,
      to: tx.args.to,
      value: tx.value ? tx.value.toNumber() : tx.args.value ? tx.args.value.toNumber() : 0,
      time: block.timestamp,
      symbol: this.web3.toAscii(tx.args.symbol),
      rawTx: tx
    })
  }

  /**
   * @param tx object
   * @returns {Promise.<Map.<TransactionModel|null>>}
   * @private
   */
  _getTxModel (tx) {
    return new Promise(resolve => {
      this.web3.eth.getBlock(tx.blockHash, (e, block) => {
        if (e) {
          resolve(null)
        } else {
          return resolve(this._transformRawTx2Model(tx, block))
        }
      })
    })
  }

  /**
   * @returns {Promise.<Map.<TransactionModel>>}
   */
  prepareTxsMap (txs) {
    return new Promise((resolve) => {
      let map = new Map()
      const promises = []
      txs.forEach(tx => promises.push(this._getTxModel(tx)))
      Promise.all(promises).then(values => {
        values.forEach(model => {
          if (model) {
            map = map.set(model.id(), model)
          }
        })
        resolve(map)
      })
    })
  }
}
