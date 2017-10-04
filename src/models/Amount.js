import BigNumber from 'bignumber.js'

export default class Amount extends BigNumber {
  constructor (value, symbol) {
    super(value)
    this._symbol = symbol
  }

  symbol () {
    return this._symbol
  }
}
