import AbstractContractDAO from './AbstractContractDAO'
import ContractsManagerDAO from './ContractsManagerDAO'
import web3Provider from '../network/Web3Provider'
import TransactionModel from '../models/TransactionModel'
import { Map } from 'immutable'
import AssetModel from '../models/AssetModel'
import LS from '../utils/LocalStorage'

export default class ExchangeDAO extends AbstractContractDAO {
  events = {
    SELL: 'Sell',
    BUY: 'Buy'
  }

  constructor (at = null) {
    super(require('chronobank-smart-contracts/build/contracts/Exchange.json'), at)
  }

  getAssetDAO (): Promise<ERC20DAO> {
    return this._call('asset').then(address => {
      return ContractsManagerDAO.getERC20DAO(address)
    })
  }

  getTokenSymbol () {
    return this.getAssetDAO().then(dao => dao.getSymbol())
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

  async getLHTBalance () {
    const address = await this.getAddress()
    const assetDAO = await this.getAssetDAO()
    return assetDAO.getAccountBalance(address)
  }

  async sell (amount, price) {
    const assetDAO = await this.getAssetDAO()
    const amountWithDecimals = assetDAO.addDecimals(amount)
    const priceInWei = this._c.toWei(price)
    const address = await this.getAddress()
    await assetDAO.approve(address, amountWithDecimals)
    return this._tx('sell', [amountWithDecimals, priceInWei])
  }

  async buy (amount, price) {
    const assetDAO = await this.getAssetDAO()
    const amountWithDecimals = assetDAO.addDecimals(amount)
    const priceInWei = this._c.toWei(price)
    const value = amountWithDecimals * priceInWei
    return this._tx('buy', [amountWithDecimals, priceInWei], null, value)
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
      this._getTransactionsByType(this.events.SELL, {fromBlock, toBlock}),
      this._getTransactionsByType(this.events.BUY, {fromBlock, toBlock})
    ]).then(([txSell, txBuy]) => txSell.merge(txBuy))
  }

  /** @private */
  _getTransactionsByType (type: string, filter = null) {
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
