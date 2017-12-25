import BigNumber from 'bignumber.js'

export default class Amount extends BigNumber {
  constructor (value = 0, symbol, isLoaded = true) {
    super(value)
    this._symbol = symbol
    this._isLoaded = isLoaded
  }

  symbol (value) {
    if (value) {
      this._symbol = value
      return new Amount(this.toNumber(), this.symbol(), this.isLoaded())
    }
    return this._symbol
  }

  isLoaded (value) {
    if (value === undefined) {
      return this._isLoaded
    }
    this._isLoaded = value
  }

  plus (value: number | string | BigNumber, base?: number) {
    return new Amount(super.plus(value, base), this._symbol, this._isLoaded)
  }

  minus (value: number | string | BigNumber, base?: number) {
    return new Amount(super.minus(value, base), this._symbol, this._isLoaded)
  }

  mul (value: number | string | BigNumber, base?: number) {
    return new Amount(super.mul(value, base), this._symbol, this._isLoaded)
  }

  div (value: number | string | BigNumber, base?: number) {
    return new Amount(super.div(value, base), this._symbol, this._isLoaded)
  }
}
