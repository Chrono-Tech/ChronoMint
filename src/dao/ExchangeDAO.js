import AbstractOtherContractDAO from './AbstractOtherContractDAO'
import OtherContractsDAO from './OtherContractsDAO'
import LHTProxyDAO from './LHTProxyDAO'
import AssetProxyDAO from './AssetProxyDAO'
import ExchangeContractModel from '../models/contracts/ExchangeContractModel'
import web3Provider from '../network/Web3Provider'
import TransactionModel from '../models/TransactionModel'
import { Map } from 'immutable'
import AssetModel from '../models/AssetModel'
import LS from '../utils/LocalStorage'

export const TX_SET_PRICES = 'setPrices'

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

  /** @returns {Promise.<ExchangeContractModel>} */
  initContractModel () {
    const Model = ExchangeDAO.getContractModel()
    return this.getAddress().then(address => new Model(address))
  }

  retrieveSettings () {
    return Promise.all([
      this._call('buyPrice'),
      this._call('sellPrice')
    ]).then(([buyPrice, sellPrice]) => {
      return {
        buyPrice: this._c.fromWei(buyPrice),
        sellPrice: this._c.fromWei(sellPrice)
      }
    })
  }

  // noinspection JSCheckFunctionSignatures
  saveSettings (model: ExchangeContractModel) {
    return OtherContractsDAO.setExchangePrices(model)
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
    return this._call('buyPrice').then(price => {
      return this._c.fromWei(price.toNumber())
    })
  }

  getSellPrice () {
    return this._call('sellPrice').then(price => {
      return this._c.fromWei(price.toNumber())
    })
  }

  getETHBalance () {
    return this.getAddress().then(address => {
      return web3Provider.getBalance(address).then(balance => this._c.fromWei(balance.toNumber()))
    })
  }

  getLHTBalance () {
    return this.getAddress().then(address => LHTProxyDAO.getAccountBalance(address))
  }

  sell (amount, price) {
    const amountInLHT = this._addDecimals(amount)
    const priceInWei = this._c.toWei(price)
    return this.getAddress().then(address => {
      return LHTProxyDAO.approve(address, amountInLHT).then(() => {
        return this._tx('sell', [amountInLHT, priceInWei])
      })
    })
  }

  buy (amount, price) {
    const priceInWei = this._c.toWei(price)
    const amountInLHT = this._addDecimals(amount)
    const value = amountInLHT * priceInWei
    return this._tx('buy', [amountInLHT, priceInWei], null, value)
  }

  getRates () {
    return Promise.all([
      this.getBuyPrice(),
      this.getSellPrice(),
      this.getTokenSymbol()
    ]).then(([buyPrice, sellPrice, symbol]) => {
      return new AssetModel({
        symbol,
        buyPrice,
        sellPrice
      })
    })
  }

  getTransactions (fromBlock, toBlock) {
    return Promise.all([
      this.getTransactionsByType(this.events.SELL, {fromBlock, toBlock}),
      this.getTransactionsByType(this.events.BUY, {fromBlock, toBlock})
    ]).then(([txSell, txBuy]) => txSell.merge(txBuy))
  }

  /**
   * @private
   */
  getTransactionsByType (type: string, filter = null) {
    return new Promise((resolve, reject) => {
      return this.contract.then(deployed => {
        const txEvent = deployed[type]({who: LS.getAccount()}, filter)
        txEvent.get((error, result) => {
          // using noop for avoid sync request
          txEvent.stopWatching(() => {})
          if (error) {
            return reject(error)
          }
          return resolve(this.parseTransactions(result))
        })
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
            symbol
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
