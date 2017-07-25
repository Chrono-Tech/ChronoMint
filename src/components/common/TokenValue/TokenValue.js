import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { CircularProgress } from 'material-ui'
import BigNumber from 'bignumber.js'
import { integerWithDelimiter } from 'utils/formatter'
import './TokenValue.scss'

class TokenValue extends Component {

  static propTypes = {
    value: PropTypes.object,
    symbol: PropTypes.string,
    className: PropTypes.string,
    prefix: PropTypes.string,
    isInvert: PropTypes.bool,
    isLoading: PropTypes.bool
  }

  getFraction (value: BigNumber) {
    const valueBN = new BigNumber(value)
    if (valueBN.gt(0)) {
      const fraction = valueBN.modulo(1)
      if (fraction.toNumber() !== 0) {
        const fractionString = ('' + fraction.toString()).slice(2)
        return `.${fractionString}`
      }
    }
    return '.00'
  }

  render () {
    const {value, isInvert, isLoading, symbol, prefix} = this.props
    const defaultMod = isInvert ? 'defaultInvert' : 'default'
    return isLoading ? (
      <CircularProgress size={24} />
    ) : (
      <span styleName={defaultMod} className='TokenValue__root'>
        {prefix}
        <span styleName='integral'>{integerWithDelimiter(value)}</span>
        <span styleName='fraction'>{this.getFraction(value)} {symbol}</span>
      </span>
    )
  }
}

export default TokenValue
