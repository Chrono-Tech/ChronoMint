import exchangeProvider from 'Login/network/ExchangeProvider'
import ExchangeOrderModel from 'models/exchange/ExchangeOrderModel'
import ExchangesCollection from 'models/exchange/ExchangesCollection'
import web3Converter from 'utils/Web3Converter'
import { ExchangeManagerABI, MultiEventsHistoryABI } from './abi'
import AbstractContractDAO from './AbstractContractDAO'

export default class ExchangeManagerDAO extends AbstractContractDAO {
  constructor (at = null) {
    super(
      ExchangeManagerABI,
      at,
      MultiEventsHistoryABI
    )
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
    let result = {}
    try {
      const assetSymbols = await exchangeProvider.getAssetSymbols()
      assetSymbols.map((exchange) => result[web3Converter.bytesToString(exchange.symbol)] = true)
    } catch (e) {
      throw new Error(`Middleware disconnected`)
    }
    return Object.keys(result)
  }

  async getExchanges (fromId: number, length: number): Array<string> {
    const adresses = await this._call('getExchanges', [fromId, length])
    return await this.getExchangeData(adresses.filter((address) => !this.isEmptyAddress(address)))
  }

  async getExchangesWithFilter (symbol: string, isSell: boolean) {
    const sort = isSell ? `&sort=sellPrice,-age` : `&sort=buyPrice,-age`
    const exchanges = await exchangeProvider.getExchangesWithFilter(web3Converter.stringToBytes(symbol), sort)
    return exchanges.map((exchange) => exchange.exchange)
  }

  getExchangesForSymbol (symbol: string) {
    return this._call('getExchangesForSymbol', [symbol])
  }

  async getExchangeData (exchangesAddresses: Array<string>) {
    let exchangesCollection = new ExchangesCollection()

    const [exchanges, symbols, owners, buyPrices, sellPrices, assetBalances, ethBalances] = await this._call('getExchangeData', [exchangesAddresses])

    exchanges.forEach((address, i) => {
      const owner = owners[i]
      const symbol = this._c.bytesToString(symbols[i])
      const buyPrice = buyPrices[i]
      const sellPrice = sellPrices[i]
      const assetBalance = assetBalances[i]
      const ethBalance = ethBalances[i]
      exchangesCollection = exchangesCollection.add(new ExchangeOrderModel({
        address: address,
        symbol,
        owner,
        buyPrice,
        sellPrice,
        assetBalance,
        ethBalance,
      }))
    })
    return exchangesCollection
  }

  watchExchangeCreated (callback) {
    this._watch('ExchangeCreated', callback)
  }
}
