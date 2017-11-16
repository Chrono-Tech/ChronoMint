import AbstractContractDAO from './AbstractContractDAO'
import ExchangesCollection from 'models/exchange/ExchangesCollection'
import ExchangeOrderModel from '../models/exchange/ExchangeOrderModel'
import web3Converter from 'utils/Web3Converter'
import Immutable from 'immutable'

export default class ExchangeManagerDAO extends AbstractContractDAO {
  constructor (at = null) {
    super(
      require('chronobank-smart-contracts/build/contracts/ExchangeManager.json'),
      at,
      require('chronobank-smart-contracts/build/contracts/MultiEventsHistory.json')
    )
  }

  async getUrl () {
    return await 'http://localhost:8081'
  }

  async createExchange (exchange: ExchangeOrderModel) {
    const tx = await this._tx(
      'createExchange',
      [
        exchange.symbol(),
        exchange.buyPrice(),
        exchange.sellPrice(),
        exchange.authorizedManager(),
        exchange.isActive(),
      ]
    )
    return tx.tx
  }

  getExchangesForOwner (owner: string) {
    return this._call('getExchangesForOwner', [owner])
  }

  async getAssetSymbols () {
    const url = await this.getUrl()
    const response = await fetch(`${url}/events/exchangecreated/`) //?distinct=symbol
    const assetSymbols = response ? await response.json() : []
    let result = {}
    assetSymbols.map(exchange => result[web3Converter.bytesToString(exchange.symbol)] = true)
    return Object.keys(result)
  }

  async getExchangesWithFilter (symbol: string, isSell: boolean) {
    const url = await this.getUrl()
    const sort = isSell ? `&sort=sellPrice,-age` : `&sort=buyPrice,-age`
    const response = await fetch(`${url}/events/exchangecreated/?symbol=/^${web3Converter.stringToBytes(symbol)}/${sort}`) //?distinct=symbol
    const exchanges = response ? await response.json() : []
    return exchanges.map(exchange => exchange.exchange)
  }

  getExchangesForSymbol (symbol: string) {
    return this._call('getExchangesForSymbol', [symbol])
  }

  async getExchangeData (exchangesAddresses: Array<string>) {
    let exchangesCollection = new ExchangesCollection()
    const [exchanges, owners, buyPrices, sellPrices, assetBalances, ethBalances] = await this._call('getExchangeData', [exchangesAddresses])

    exchanges.forEach((item, i) => {
      const owner = owners[i]
      const buyPrice = buyPrices[i]
      const sellPrice = sellPrices[i]
      const assetBalance = assetBalances[i]
      const ethBalance = ethBalances[i]
      // const symbolString = this._c.bytesToString(symbol[i])
      exchangesCollection = exchangesCollection.add(new ExchangeOrderModel({
        address: item,
        owner,
        buyPrice,
        sellPrice,
        assetBalance,
        ethBalance,
      }))
    })
    return exchangesCollection
  }

  watchExchanges (account, dispatch) {
    this._watch('ExchangeCreated', tx => {
      // eslint-disable-next-line
      console.log('--ExchangeManagerDAO#tx', tx)
    }, { by: account })
  }
}
