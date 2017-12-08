import BigNumber from 'bignumber.js'

export default class Amount extends BigNumber {
  constructor (value = 0, symbol, isLoaded = true) {
    super(value)
    this._symbol = symbol
    this._isLoaded = isLoaded
  }

  symbol () {
    return this._symbol
  }

  isLoaded (value) {
    if (value === undefined) {
      return this._isLoaded
    }
    this._isLoaded = value
  }
}
