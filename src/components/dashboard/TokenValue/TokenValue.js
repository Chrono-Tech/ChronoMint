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
    // TODO @dkchv: research for this again. Wrong results for 99.999999...
    try {
      if (value.gt(0)) {
        const fraction = value.modulo(1)
        if (fraction.toNumber() !== 0) {
          const fractionString = ('' + fraction.toString()).slice(2)
          return `.${fractionString}`
        }
      }
    } catch (e) {
      // eslint-disable-next-line
      console.error('You should pass only BigNumber into the TokenValue component', e)
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
