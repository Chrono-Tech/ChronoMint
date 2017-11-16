class ExchangeProvider {

  url () {
    return 'http://localhost:8081'
  }

  async getAssetSymbols () {
    const response = await fetch(`${this.url()}/events/exchangecreated/`) //?distinct=symbol
    const assetSymbols = response ? await response.json() : []
    return assetSymbols
  }

  async getExchangesWithFilter (symbol: string, sort: string) {
    const response = await fetch(`${this.url()}/events/exchangecreated/?symbol=/^${symbol}/${sort}`) //?distinct=symbol
    const exchanges = response ? await response.json() : []
    return exchanges
  }
}

export default new ExchangeProvider()
