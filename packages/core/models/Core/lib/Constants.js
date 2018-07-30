const SECOND = 1000
const MINUTE = SECOND * 60
const HOUR = MINUTE * 60
const DAY = HOUR * 24
const WEEK = DAY * 7
const MONTH = DAY * 30

const SolidityTypes = Object.freeze({
  Address: 'address',
  Uint256: 'uint256',
  Uint8: 'uint8',
  Uint: 'uint'
})

module.exports = {
  SolidityTypes,
  ADDRESS_PATTERN: /^0x[0-9a-fA-F]{40}$/,
  EC_SIGN_PARAMETER: /^0[xX][0-9A-Fa-f]{64}$/,
  HEX: /^0[xX][0-9A-Fa-f]*$/,
  SECOND,
  MINUTE,
  HOUR,
  DAY,
  WEEK,
  MONTH,
  Candles: {
    Intervals: {
      '1H': HOUR,
      '1D': DAY,
      '1W': WEEK,
      '1M': MONTH
    }
  },
  OrderBook: {
    aggregate: {
      'no': 0,
      '2.5': 0.025
    }
  },
  auth: {
    header: {
      prefix: 'Signature'
    }
  },
  cryptoCurrency: {
    BTC: 'BTC',
    ETH: 'ETH'
  },
  wrappedCryptoCurrency: {
    WBTC: 'WBTC',
    WETH: 'WETH'
  }
}
