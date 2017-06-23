import React, { Component } from 'react'
import PropTypes from 'prop-types'
import './TokenValue.scss'

class TokenValue extends Component {
  static propTypes = {
    value: PropTypes.number.isRequired,
    symbol: PropTypes.string.isRequired,
    className: PropTypes.string
  }

  render () {
    const {value, symbol, className} = this.props
    return (
      <div className={className} styleName={className ? '' : 'default'}>
        <span styleName='integral'>{Math.floor(value)}</span>
        <span styleName='fraction'>.{value % 1 || '00'} {symbol}</span>
      </div>
    )
  }
}

export default TokenValue
