import React, { Component } from 'react'
import PropTypes from 'prop-types'
import './TokenValue.scss'
import { CircularProgress } from 'material-ui'

class TokenValue extends Component {
  static propTypes = {
    value: PropTypes.number,
    symbol: PropTypes.string.isRequired,
    className: PropTypes.string,
    isInvert: PropTypes.bool,
    isLoading: PropTypes.bool
  }

  render () {
    const {value, symbol, isInvert, isLoading} = this.props
    const defaultMod = isInvert ? 'defaultInvert' : 'default'
    return isLoading ? (
      <CircularProgress size={24} />
    ) : (
      <div styleName={defaultMod} className={`TokenValue__${defaultMod}`}>
        <span styleName='integral'>{Math.floor(+value)}</span>
        <span styleName='fraction'>.{+value % 1 || '00'} {symbol}</span>
      </div>
    )
  }
}

export default TokenValue
