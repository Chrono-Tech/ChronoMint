import ExchangeManagerDAO from 'dao/ExchangeManagerDAO'
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

  subscribeToCreateExchange () {
    const dao = this.getExchangeManagerDAO()

    return Promise.all([
      dao.watchExchangeCreated((result) => {
        this.emit('ExchangeCreated', result)
      }),
    ])
  }

  subscribeToExchangeManagerDAO (exchange) {
    const dao = this.getExchangeManagerDAO(exchange.address())

    return Promise.all([
      dao.watchExchangeCreated(exchange, (result) => {
        this.emit('ExchangeCreated', result)
      }),
    ])
  }
}

export default new ExchangeService()
