import axios from 'axios'

class ExchangeProvider {

  url () {
    return '/_exchange/'
  }

  async getAssetSymbols () {
    const response = await fetch(`${this.url()}events/exchangecreated/`) //?distinct=symbol
    return response ? await response.json() : []
  }

  async getExchangesWithFilter (symbol: string, sort: string) {
    const symbolStr = symbol ? `?symbol=/^${symbol}/&` : `?`
    const response = await axios.get(`${this.url()}/events/exchangecreated/${symbolStr}${sort}`)
    const exchanges = response ? await response.json() : []
    return exchanges.map((exchange) => exchange.exchange)
  }
}

export default new ExchangeProvider()
