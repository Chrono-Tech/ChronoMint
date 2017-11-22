import TokenModel from 'models/TokenModel'
import ExchangeManagerDAO from 'dao/ExchangeManagerDAO'
import { ExchangeDAO } from 'dao/ExchangeDAO'
import EventEmitter from 'events'

class ExchangeService extends EventEmitter {

  constructor () {
    super(...arguments)
    this._cache = {}
  }

  getExchangeManagerDAO (address) {
    if (!this._cache[address]) {
      this._cache[address] = new ExchangeManagerDAO(address)
    }
    return this._cache[address]
  }

  getExchangeDAO (address) {
    this._cache[address] = new ExchangeDAO(address)
    return this._cache[address]
  }

  subscribeToCreateExchange (account) {
    const dao = this.getExchangeManagerDAO(account)

    return Promise.all([
      dao.watchExchangeCreated(account, (result) => {
        this.emit('ExchangeCreated', result)
      }),
    ])
  }

  subscribeToExchange (address) {
    if (this._cache[address]) return null

    // const dao = token.dao()
    // await dao.watchTransfer((notice) => dispatch(watchTransfer(notice)))

    const dao = this.getExchangeDAO(address)

    return Promise.all([
      dao.watchError((result) => {
        this.emit('Error', result)
      }),
      dao.watchFeeUpdated(address, (result) => {
        this.emit('FeeUpdated', result)
      }),
      dao.watchPricesUpdated(address, (result) => {
        this.emit('PricesUpdated', result)
      }),
      dao.watchActiveChanged(address, (result) => {
        this.emit('ActiveChanged', result)
      }),
      dao.watchBuy(address, (result) => {
        this.emit('Buy', result)
      }),
      dao.watchSell(address, (result) => {
        this.emit('Sell', result)
      }),
      dao.watchWithdrawEther(address, (result) => {
        // TODO
        this.emit('WithdrawEther', result)
      }),
      dao.watchWithdrawTokens(address, (result) => {
        // TODO
        this.emit('WithdrawTokens', result)
      }),
      dao.watchReceivedEther(address, (result) => {
        this.emit('ReceivedEther', result)
      }),
    ])
  }

  subscribeToToken (token: TokenModel, exchange: string) {
    if (this._cache[token.id()]) return null

    this._cache[token.id()] = token.dao()
    const dao = token.dao()

    return Promise.all([
      dao.watchTransfer((result) => {
        this.emit('Transfer', result.tx())
      }, { account: exchange }),
    ])
  }
}

export default new ExchangeService()
