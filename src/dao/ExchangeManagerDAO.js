import AbstractContractDAO from './AbstractContractDAO'
import ExchangesCollection from 'models/exchange/ExchangesCollection'
import ExchangeOrderModel from '../models/exchange/ExchangeOrderModel'
import web3Converter from 'utils/Web3Converter'

export default class ExchangeManagerDAO extends AbstractContractDAO {
  constructor (at = null) {
    super(
      require('chronobank-smart-contracts/build/contracts/ExchangeManager.json'),
      at,
      require('chronobank-smart-contracts/build/contracts/MultiEventsHistory.json')
    )
  }

  createExchange (symbol, useTicker, sellPrice, buyPrice) {
    const tx = this._tx('createExchange', [symbol, useTicker, sellPrice, buyPrice])
    return tx.tx
  }

  getExchangesForOwner (owner: string) {
    return this._call('getExchangesForOwner', [owner])
  }

  async getAssetSymbols () {
    const result = await this._call('getAssetSymbols')
    return result.map(symbol => web3Converter.bytesToString(symbol))
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
        id: item,
      }))
    })
    return exchangesCollection
  }

  watchExchanges (account, dispatch) {
    this._watch('ExchangeCreated', tx => {
      // eslint-disable-next-line
      console.log('--ExchangeManagerDAO#tx', tx)
    }, {by: account})
  }
}
