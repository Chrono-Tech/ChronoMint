import axios from 'axios'
import networkService from '@chronobank/login/network/NetworkService'
import { NETWORK_MAIN_ID, MIDDLEWARE_MAP } from './settings'

class ExchangeProvider {

  url () {
    // TODO @abdulov remove it
    // throw new Error() // make an Error
    const { network } = networkService.getProviderSettings()

    if (!network.id) {
      return MIDDLEWARE_MAP.eth.local
    }

    if (network.id === NETWORK_MAIN_ID) {
      return MIDDLEWARE_MAP.eth.mainnet
    } else {
      return MIDDLEWARE_MAP.eth.testnet
    }
  }

  async getAssetSymbols () {
    // eslint-disable-next-line
    console.log('getAssetSymbols', `${this.url()}events/exchangecreated/`)
    const response = await axios.get(`${this.url()}events/exchangecreated/`) //?distinct=symbol
    return response ? response.data : []
  }

  async getExchangesWithFilter (symbol: string, sort: string, from: number, length: number) {
    const symbolStr = symbol ? `?symbol=/^${symbol}/&` : `?`
    const offset = `&offset=${from}`
    const limit = `&limit=${length}`
    const response = await axios.get(`${this.url()}events/exchangecreated/${symbolStr}${sort}${offset}${limit}`)
    const exchanges = response ? response.data : []
    return exchanges.map((exchange) => exchange.exchange)
  }
}

export default new ExchangeProvider()
