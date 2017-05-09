/* eslint new-cap: ["error", { "capIsNewExceptions": ["Buy", "Sell"] }] */
import AbstractOtherContractDAO from './AbstractOtherContractDAO'
import OtherContractsDAO from './OtherContractsDAO'
import LHTProxyDAO from './LHTProxyDAO'
import AssetProxyDAO from './AssetProxyDAO'
import ExchangeContractModel from '../models/contracts/ExchangeContractModel'
import web3Provider from '../network/Web3Provider'
import TransactionModel from '../models/TransactionModel'
import { Map } from 'immutable'

export class ExchangeDAO extends AbstractOtherContractDAO {
  events = {
    SELL: 'Sell',
    BUY: 'Buy'
  }

  static getTypeName () {
    return 'Exchange'
  }

  static getJson () {
    return require('chronobank-smart-contracts/build/contracts/Exchange.json')
  }

  constructor (at = null) {
    super(ExchangeDAO.getJson(), at)
  }

  static getContractModel () {
    return ExchangeContractModel
  }

  /** @return {Promise.<ExchangeContractModel>} */
  initContractModel () {
    const Model = ExchangeDAO.getContractModel()
    return this.getAddress().then(address => new Model(address))
  }

  retrieveSettings () {
    return Promise.all([
      this._call('buyPrice'),
      this._call('sellPrice')
    ]).then(([buyPrice, sellPrice]) => {
      return {buyPrice: parseInt(buyPrice, 10), sellPrice: parseInt(sellPrice, 10)}
    })
  }

  // noinspection JSCheckFunctionSignatures
  saveSettings (model: ExchangeContractModel) {
    return this.getAddress().then(address => {
      return OtherContractsDAO.setExchangePrices(address, model.buyPrice(), model.sellPrice())
    })
  }

  /**
   * @returns {Promise.<AssetProxyDAO>}
   */
  getAssetProxy () {
    return this._call('asset').then(address => new AssetProxyDAO(address))
  }

  getTokenSymbol () {
    return this.getAssetProxy().then(proxy => proxy.getSymbol())
  }

  getBuyPrice () {
    return this._call('buyPrice')
  }

  getSellPrice () {
    return this._call('sellPrice')
  }

  sell (amount, price) {
    amount *= 100000000
    return this.getAddress().then(address => {
      return LHTProxyDAO.approve(address, amount).then(() => {
        return this._tx('sell', [amount, this.converter.toWei(price)])
      })
    })
  }

  buy (amount, price) {
    const priceInWei = this.converter.toWei(price)
    const amountInWhat = amount * 100000000
    const value = amountInWhat * priceInWei
    return this._tx('buy', [amountInWhat, priceInWei], null, value)
  }

  // watchError () {
  //   this.contract.then(deployed => {
  //     deployed.Error().watch((e, r) => {
  //       console.log(e, r)
  //       if (!e) {
  //         console.error('ERROR')
  //         console.error(this.converter.bytesToString(r.args.message))
  //       } else {
  //         console.error('ERROR', e)
  //       }
  //     })
  //   })
  // }

  getTransactionsByType (type: string, account, filter = null) {
    return new Promise((resolve, reject) => {
      return this.contract.then(deployed => {
        const txEvent = deployed[type]({who: account}, filter)
        txEvent.get((error, result) => {
          if (error) {
            return reject(error)
          }
          return resolve(this.parseTransactions(result))
        })
        txEvent.stopWatching()
      })
    })
  }

  parseTransactions (txHashList: Array) {
    let transactions = new Map()
    if (txHashList.length === 0) {
      return transactions
    }

    return this.getTokenSymbol().then(symbol => {
      return Promise.all(txHashList.map(txn => {
        return web3Provider.getBlock(txn.blockHash).then(block => {
          return new TransactionModel({
            txHash: txn.transactionHash,
            blockHash: txn.blockHash,
            blockNumber: txn.blockNumber,
            transactionIndex: txn.transactionIndex,
            value: txn.args.token,
            time: block.timestamp,
            credited: txn.event === 'Buy',
            symbol,
            action: txn.event
          })
        })
      })).then(values => {
        values.forEach(item => {
          transactions = transactions.set(item.id(), item)
        })
        return transactions
      })
    })
  }
}

export default new ExchangeDAO()
