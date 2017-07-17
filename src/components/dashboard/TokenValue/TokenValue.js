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
    isInvert: PropTypes.bool,
    isLoading: PropTypes.bool
  }

  getFraction (value: BigNumber) {
    // TODO @dkchv: research for this again. Wrong results for 99.999999...
    if (value.gt(0)) {
      const fraction = value.modulo(1)
      if (fraction.toNumber() !== 0) {
        const fractionString = ('' + fraction.toString()).slice(2)
        return `.${fractionString}`
      }
    }
    return '.00'
  }

  render () {
    const {value, isInvert, isLoading, symbol} = this.props
    const defaultMod = isInvert ? 'defaultInvert' : 'default'
    return isLoading ? (
      <CircularProgress size={24} />
    ) : (
      <div styleName={defaultMod} className='TokenValue__root'>
        <span styleName='integral'>{integerWithDelimiter(value.toNumber())}</span>
        <span styleName='fraction'>{this.getFraction(value)} {symbol}</span>
      </div>
    )
  }
}

export default TokenValue
