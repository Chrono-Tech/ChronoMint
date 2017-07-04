import React, { Component } from 'react'
import PropTypes from 'prop-types'
import './TokenValue.scss'
import { CircularProgress } from 'material-ui'
import BigNumber from 'bignumber.js'

class TokenValue extends Component {
  static propTypes = {
    value: PropTypes.number,
    symbol: PropTypes.string,
    className: PropTypes.string,
    isInvert: PropTypes.bool,
    isLoading: PropTypes.bool
  }

  getFraction (value) {
    if (value) {
      const fraction = new BigNumber(value).modulo(1)
      if (fraction.toNumber() !== 0) {
        const fractionString = ('' + fraction.toNumber()).slice(2)
        return `.${fractionString}`
      }
    }
    return '.00'
  }

  getIntegral (value) {
    // \u00a0 = &nbsp;
    return Math.floor(+value).toFixed(0).replace(/(\d)(?=(\d{3})+$)/g, '$1\u00a0')
  }

  render () {
    const {value, isInvert, isLoading, symbol} = this.props
    const defaultMod = isInvert ? 'defaultInvert' : 'default'
    return isLoading ? (
      <CircularProgress size={24} />
    ) : (
      <div styleName={defaultMod} className={`TokenValue__${defaultMod}`}>
        <span styleName='integral'>{this.getIntegral(3124243241414)}</span>
        <span styleName='fraction'>{this.getFraction(value)} {symbol}</span>
      </div>
    )
  }
}

export default TokenValue
