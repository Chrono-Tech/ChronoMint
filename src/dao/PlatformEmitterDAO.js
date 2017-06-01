import AbstractContractDAO from './AbstractContractDAO'
import TransactionModel from '../models/TransactionModel'
import web3Provider from '../network/Web3Provider'
import web3utils from 'web3/lib/utils/utils'

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
  static _transformRawTx2Model (tx: Object, block: Object) {
    return new TransactionModel({
      txHash: tx.transactionHash,
      blockHash: tx.blockHash,
      blockNumber: tx.blockNumber,
      transactionIndex: tx.transactionIndex,
      from: tx.args.from,
      to: tx.args.to,
      value: tx.value ? tx.value.toNumber() : tx.args.value ? tx.args.value.toNumber() : 0,
      time: block.timestamp,
      symbol: web3utils.toAscii(tx.args.symbol),
      rawTx: tx
    })
  }

  /**
   * @param tx object
   * @returns {Promise.<Map.<TransactionModel|null>>}
   * @private
   */
  static _getTxModel (tx) {
    return new Promise(resolve => {
      web3Provider.getWeb3().then(web3 => {
        web3.eth.getBlock(tx.blockHash, (e, block) => {
          if (e) {
            resolve(null)
          } else {
            return resolve(this._transformRawTx2Model(tx, block))
          }
        })
      })
    })
  }

  /**
   * @returns {Promise.<Map.<TransactionModel>>}
   */
  static prepareTxsMap (txs) {
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
