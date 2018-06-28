/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import axios from 'axios'
import networkService from './NetworkService'
import { NETWORK_MAIN_ID, MIDDLEWARE_MAP, LOCAL_ID } from './settings'

class ExchangeProvider {

  url () {
    const { network } = networkService.getProviderSettings()

    switch (network.id) {
      case NETWORK_MAIN_ID:
        return MIDDLEWARE_MAP.eth.mainnet
      case LOCAL_ID:
        return MIDDLEWARE_MAP.eth.local
      default:
        return MIDDLEWARE_MAP.eth.testnet
    }
  }

  async getAssetSymbols () {
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
