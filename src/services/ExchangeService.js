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
    if (!this._cache[address]) {
      this._cache[address] = new ExchangeDAO(address)
    }
    return this._cache[address]
  }

  subscribeToCreateExchange () {
    const dao = this.getExchangeManagerDAO()

    return Promise.all([
      dao.watchExchangeCreated((result) => {
        this.emit('ExchangeCreated', result)
      }),
    ])
  }

  subscribeToExchangeManager (address) {
    const dao = this.getExchangeDAO(address)

    return Promise.all([
      // dao.watchError((result) => {
      //   this.emit('Error', result)
      // }),
      // dao.watchFeeUpdated((result) => {
      //   this.emit('FeeUpdated', result)
      // }),
      // dao.watchPricesUpdated((result) => {
      //   this.emit('PricesUpdated', result)
      // }),
      // dao.watchActiveChanged((result) => {
      //   this.emit('ActiveChanged', result)
      // }),
      dao.watchBuy((result) => {
        this.emit('Buy', result)
      }),
      dao.watchSell((result) => {
        this.emit('Sell', result)
      }),
      // dao.watchWithdrawEther((result) => {
      //   this.emit('WithdrawEther', result)
      // }),
      // dao.watchWithdrawTokens((result) => {
      //   this.emit('WithdrawTokens', result)
      // }),
      // dao.watchReceivedEther((result) => {
      //   this.emit('ReceivedEther', result)
      // }),
    ])
  }
}

export default new ExchangeService()
