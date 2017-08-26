import BigNumber from 'bignumber.js'

export class BitcoinDAO {

  static getName () {
    return 'Bitcoin'
  }

  isInitialized () {
    return true
  }

  getSymbol () {
    return 'BTC'
  }

  getDecimals () {
    return 8
  }

  // eslint-disable-next-line no-unused-vars
  transfer (account, amount: BigNumber) {
    throw new Error('should be overridden')
  }
}

export default new BitcoinDAO()
