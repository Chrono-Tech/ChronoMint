/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import BigNumber from 'bignumber.js'
import exchangeProvider from '@chronobank/login/network/ExchangeProvider'
import ExchangeOrderModel from '../models/exchange/ExchangeOrderModel'
import ExchangesCollection from '../models/exchange/ExchangesCollection'
import web3Converter from '../utils/Web3Converter'
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

  async createExchange (exchange: ExchangeOrderModel/*, token: TokenModel*/) {
    const buyPrice = this._c.toWei(exchange.buyPrice())
    const sellPrice = this._c.toWei(exchange.sellPrice())

    const tx = await this._tx(
      'createExchange',
      [
        exchange.symbol(),
        buyPrice,
        sellPrice,
        false, // _useExternalPriceTicker
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
          result[ web3Converter.bytesToString(exchange.symbol).toUpperCase() ] = true
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
      addresses = await exchangeProvider.getExchangesWithFilter(filter.symbol && web3Converter.stringToBytes(filter.symbol), sort, fromId, length)
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

    const [ symbols, buyPrices, sellPrices, assetBalances, ethBalances ] = await this._call('getExchangeData', [ exchangesAddresses ])

    symbols.forEach((symbolInBytes, i) => {
      const symbol = this._c.bytesToString(symbolInBytes)
      const buyPrice = new BigNumber(buyPrices[ i ])
      const sellPrice = new BigNumber(sellPrices[ i ])
      const assetBalance = assetBalances[ i ]
      const ethBalance = ethBalances[ i ]

      exchangesCollection = exchangesCollection.add(new ExchangeOrderModel({
        address: exchangesAddresses[ i ],
        symbol,
        buyPrice: buyPrice,
        sellPrice: sellPrice,
        assetBalance: assetBalance,
        ethBalance: ethBalance,
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
