/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import EventEmitter from 'events'

import openSocket from 'socket.io-client'

import CCC from './ccc-streamer-utilities'

const markets = [
  'BTC38',
  'BTCC',
  'BTCE',
  'BTER',
  'Bit2C',
  'Bitfinex',
  'Bitstamp',
  'BitTrex',
  'CCEDK',
  'Cexio',
  'Coinbase',
  'Coinfloor',
  'Coinse',
  'Coinsetter',
  'Cryptopia',
  'Cryptsy',
  'Gatecoin',
  'Gemini',
  'HitBTC',
  'Huobi',
  'itBit',
  'Kraken',
  'LakeBTC',
  'LocalBitcoins',
  'MonetaGo',
  'OKCoin',
  'Poloniex',
  'Yacuna',
  'Yunbi',
  'Yobit',
  'Korbit',
  'BitBay',
  'BTCMarkets',
  'QuadrigaCX',
  'CoinCheck',
  'BitSquare',
  'Vaultoro',
  'MercadoBitcoin',
  'Unocoin',
  'Bitso',
  'BTCXIndia',
  'Paymium',
  'TheRockTrading',
  'bitFlyer',
  'Quoine',
  'Luno',
  'EtherDelta',
  'Liqui',
  'bitFlyerFX',
  'BitMarket',
  'LiveCoin',
  'Coinone',
  'Tidex',
  'Bleutrade',
  'EthexIndia',
]

const pairs = [
  'BTC~USD',
  'ETH~USD',
  'BTC~USDT',
  'ETH~USDT',
  'TIME~USDT',
]

class MarketSocket extends EventEmitter {
  constructor (type) {
    super()

    this.subscription = []
    this.type = type || CCC.TYPE.CURRENTAGG
  }

  init () {
    for (const pair of pairs) {
      if (this.type === CCC.TYPE.CURRENT) {
        for (const market of markets) {
          this.subscription.push(`2~${market}~${pair}`)
        }
      } else {
        this.subscription.push(`${this.type}~CCCAGG~${pair}`)
      }
    }
  }

  _onSocketUpdate = (message) => {
    const messageType = message.substring(0, message.indexOf('~'))

    if (messageType === this.type) {
      const result = CCC.unpack(message) || {}

      const keys = Object.keys(result)

      for (let i = 0; i < keys.length; ++i) {
        result[keys[i]] = result[keys[i]]
      }
      result.TOSYMBOL = 'USD'
      result.symbol = result.FROMSYMBOL

      this.emit('update', result)
    }
  }

  start () {
    // Only https endpoint available
    this.socket = openSocket('https://streamer.cryptocompare.com/')
    this.socket.emit('SubAdd', { subs: this.subscription })
    this.socket.on('m', this._onSocketUpdate)
  }

  disconnect () {
    this.socket.close()
  }
}

export default new MarketSocket(CCC.TYPE.CURRENTAGG)
