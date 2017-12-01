import axios from 'axios'

class ExchangeProvider {

  url () {
    return 'http://localhost:8081'
  }

  async getAssetSymbols () {

    const response = await axios.get(`${this.url()}/events/exchangecreated/`)
    const assetSymbols = response ? await response.json() : []
    return assetSymbols
  }

  async getExchangesWithFilter (symbol: string, sort: string) {
    const symbolStr = symbol ? `?symbol=/^${symbol}/&` : `?`
    const response = await axios.get(`${this.url()}/events/exchangecreated/${symbolStr}${sort}`)
    const exchanges = response ? await response.json() : []
    return exchanges.map((exchange) => exchange.exchange)
  }
}

export default new ExchangeProvider()
