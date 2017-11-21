import exchangeProvider from 'Login/network/ExchangeProvider'
import exchangeService from 'services/ExchangeService'
import ExchangeOrderModel from 'models/exchange/ExchangeOrderModel'
import ExchangesCollection from 'models/exchange/ExchangesCollection'
import TokensCollection from 'models/exchange/TokensCollection'
import TokenModel from 'models/TokenModel'
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

  async createExchange (exchange: ExchangeOrderModel, token: TokenModel) {
    const tx = await this._tx(
      'createExchange',
      [
        exchange.symbol(),
        token.dao().addDecimals(exchange.buyPrice()),
        token.dao().addDecimals(exchange.sellPrice()),
        exchange.authorizedManager(),
        exchange.isActive(),
      ],
      exchange
    )
    return tx.tx
  }

  async getExchangesForOwner (owner: string, tokens: TokensCollection) {
    const addresses = await this._call('getExchangesForOwner', [owner])
    return await this.getExchangeData(addresses.filter((address) => !this.isEmptyAddress(address)), tokens)
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

  async getExchanges (fromId: number, length: number, tokens: TokensCollection, filter: Object = {}, options: Object = {}): Array<string> {
    let addresses
    if (options.fromMiddleWare) {
      const sort = filter.isBuy ? `sort=buyPrice,-age` : `sort=sellPrice,-age`
      addresses = await exchangeProvider.getExchangesWithFilter(filter.symbol && web3Converter.stringToBytes(filter.symbol), sort)
    } else {
      addresses = await this._call('getExchanges', [fromId, length])
    }
    return await this.getExchangeData(addresses.filter((address) => !this.isEmptyAddress(address)), tokens)
  }

  async getExchangeData (exchangesAddresses: Array<string>, tokens: TokensCollection) {
    let exchangesCollection = new ExchangesCollection()

    const [exchanges, symbols, owners, buyPrices, sellPrices, assetBalances, ethBalances] = await this._call('getExchangeData', [exchangesAddresses])

    exchanges.forEach((address, i) => {
      try {
        exchangeService.subscribeToExchangeManager(address)
      } catch (e) {
        // eslint-disable-next-line
        console.error('watch error', e.message)
      }
      const owner = owners[i]
      const symbol = this._c.bytesToString(symbols[i])
      const buyPrice = buyPrices[i]
      const sellPrice = sellPrices[i]
      const assetBalance = assetBalances[i]
      const ethBalance = ethBalances[i]
      const token = tokens.getBySymbol(symbol)
      exchangesCollection = exchangesCollection.add(new ExchangeOrderModel({
        address: address,
        symbol,
        owner,
        buyPrice: token.dao().removeDecimals(buyPrice),
        sellPrice: token.dao().removeDecimals(sellPrice),
        assetBalance: token.dao().removeDecimals(assetBalance),
        ethBalance: this._c.fromWei(ethBalance),
      }))
    })
    return exchangesCollection
  }

  async getExchangesCount () {
    const number = await this._call('getExchangesCount')
    return number.toNumber()
  }

  watchExchangeCreated (callback) {
    this._watch('ExchangeCreated', callback)
  }

}
