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

  getFraction() {
    const fraction = +this.props.value % 1
    const fractionString = fraction === 0 ? '00' : (''+fraction).slice(1)
    return `.${fractionString} ${this.props.symbol}`
  }

  render () {
    const {value, isInvert, isLoading} = this.props
    const defaultMod = isInvert ? 'defaultInvert' : 'default'
    return isLoading ? (
      <CircularProgress size={24} />
    ) : (
      <div styleName={defaultMod} className={`TokenValue__${defaultMod}`}>
        <span styleName='integral'>{Math.floor(+value)}</span>
        <span styleName='fraction'>{this.getFraction()}</span>
      </div>
    )
  }
}

export default TokenValue
