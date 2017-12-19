import tokenService from 'services/TokenService'
import exchangeProvider from '@chronobank/login/network/ExchangeProvider'
import exchangeService from 'services/ExchangeService'
import ExchangeOrderModel from 'models/exchange/ExchangeOrderModel'
import ExchangesCollection from 'models/exchange/ExchangesCollection'
import TokensCollection from 'models/tokens/TokensCollection'
import TokenModel from 'models/tokens/TokenModel'
import BigNumber from 'bignumber.js'
import web3Converter from 'utils/Web3Converter'
import { ExchangeManagerABI, MultiEventsHistoryABI } from './abi'
import AbstractContractDAO from './AbstractContractDAO'

export default class ExchangeManagerDAO extends AbstractContractDAO {
  constructor (at = null) {
    super(
      ExchangeManagerABI,
      at,
      MultiEventsHistoryABI,
    )
  }

  async createExchange (exchange: ExchangeOrderModel, token: TokenModel) {
    const buyPrice = this._c.toWei(exchange.buyPrice()).div(Math.pow(10, token.decimals()))
    const sellPrice = this._c.toWei(exchange.sellPrice()).div(Math.pow(10, token.decimals()))

    const tx = await this._tx(
      'createExchange',
      [
        exchange.symbol(),
        buyPrice.mul(Math.pow(10, buyPrice.decimalPlaces())),
        buyPrice.decimalPlaces(),
        sellPrice.mul(Math.pow(10, sellPrice.decimalPlaces())),
        sellPrice.decimalPlaces(),
        exchange.authorizedManager(),
        exchange.isActive(),
      ],
      exchange,
    )
    return tx.tx
  }

  async getExchangesForOwner (owner: string) {
    const addresses = await this._call('getExchangesForOwner', [ owner ])
    return await this.getExchangeData(addresses.filter((address) => !this.isEmptyAddress(address)))
  }

  async getAssetSymbols () {
    let result = {}
    try {
      const assetSymbols = await exchangeProvider.getAssetSymbols()
      assetSymbols.map((exchange) => {
        if (exchange.symbol) {
          result[ web3Converter.bytesToString(exchange.symbol) ] = true
        }
      })
    } catch (e) {
      throw new Error(`Middleware disconnected`)
    }
    return Object.keys(result)
  }

  async getExchanges (fromId: number, length: number, filter: Object = {}, options: Object = {}): Array<string> {
    let addresses
    if (options.fromMiddleWare) {
      const sort = filter.isBuy ? `sort=buyPrice,-age` : `sort=sellPrice,-age`
      addresses = await exchangeProvider.getExchangesWithFilter(filter.symbol && web3Converter.stringToBytes(filter.symbol), sort)
    } else {
      addresses = await this._call('getExchanges', [ fromId, length ])
    }
    return await this.getExchangeData(addresses.filter((address) => !this.isEmptyAddress(address)))
  }

  async getExchangeData (exchangesAddresses: Array<string>) {
    let exchangesCollection = new ExchangesCollection()

    if (!exchangesAddresses.length) {
      return exchangesCollection
    }

    const [ symbols, buyPrices, buyDecimals, sellPrices, sellDecimals, assetBalances, ethBalances ] = await this._call('getExchangeData', [ exchangesAddresses ])

    exchangesAddresses.forEach((address, i) => {
      const symbol = this._c.bytesToString(symbols[ i ])
      const buyPrice = new BigNumber(buyPrices[ i ])
      const sellPrice = new BigNumber(sellPrices[ i ])
      const assetBalance = assetBalances[ i ]
      const ethBalance = ethBalances[ i ]

      // TODO @abdulov fix watchers
      // try {
      //   exchangeService.subscribeToExchange(address)
      //   exchangeService.subscribeToToken(token, address)
      // } catch (e) {
      //   eslint-disable-next-line
      //   console.error('watch error', e.message)
      // }

      exchangesCollection = exchangesCollection.add(new ExchangeOrderModel({
        address: address,
        symbol,
        buyPrice: this._c.fromWei(buyPrice),
        sellPrice: this._c.fromWei(sellPrice),
        assetBalance: assetBalance,
        ethBalance: this._c.fromWei(ethBalance),
      }))
    })
    return exchangesCollection
  }

  async getExchangesCount () {
    const number = await this._call('getExchangesCount')
    return number.toNumber()
  }

  watchExchangeCreated (account, callback) {
    this._watch('ExchangeCreated', (tx) => {
      callback(tx)
    })
  }

}
