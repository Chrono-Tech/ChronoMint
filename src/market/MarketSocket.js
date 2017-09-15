import openSocket from 'socket.io-client'
import CCC from 'market/ccc-streamer-utilities'
import EventEmitter from 'events'

//Format: {SubscriptionId}~{ExchangeName}~{FromSymbol}~{ToSymbol}
//Use SubscriptionId 0 for TRADE, 2 for CURRENT and 5 for CURRENTAGG
//For aggregate quote updates use CCCAGG as market
let markets = [
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
  'EthexIndia'
]

let pairs = [
  'BTC~USD',
  // 'ETH~USD',
  // 'TIME~ETH',
  // 'TIME~BTC',
]


class MarketSocket extends EventEmitter {
  constructor (type) {
    super()

    this.subscription = []
    this.type = type || CCC.STATIC.TYPE.CURRENTAGG
  }

  init () {
    const {type} = this
    for (let pair of pairs) {
      if (type === CCC.STATIC.TYPE.CURRENT) {
        for (let market of markets) {
          this.subscription.push(`2~${market}~${pair}`)
        }
      } else {
        this.subscription.push(`${type}~CCCAGG~${pair}`)
      }
    }
  }

  start () {
    const {type} = this
    this.socket = openSocket('https://streamer.cryptocompare.com/')
    this.socket.emit('SubAdd', {subs: this.subscription})

    this.socket.on("m", function (message) {
      let messageType = message.substring(0, message.indexOf("~"))
      if (messageType === type) {
        const result = CCC.CURRENT.unpack(message) || {}
        let keys = Object.keys(result)

        for (let i = 0; i < keys.length; ++i) {
          result[keys[i]] = result[keys[i]]
        }
        // eslint-disable-next-line
        console.log(result)
        result['pair'] = result.FROMSYMBOL + result.TOSYMBOL
        result['CHANGE24H'] = result["PRICE"] - result["OPEN24HOUR"]
        result['CHANGEPCT24H'] = result["CHANGE24H"] / result["OPEN24HOUR"] * 100

        // eslint-disable-next-line
        console.log(result)
        // this.emit('update', result)
      }
    })
  }

  stop () {

  }
}

export default new MarketSocket(CCC.STATIC.TYPE.CURRENTAGG)
