import BigNumber from 'bignumber.js'
import Preloader from 'components/common/Preloader/Preloader'
import Amount from 'models/Amount'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { DUCK_MARKET } from 'redux/market/action'
import { integerWithDelimiter } from 'utils/formatter'

import './TokenValue.scss'

const mapStateToProps = (state) => {
  const { isInited, prices, selectedCurrency } = state.get(DUCK_MARKET)
  return {
    isInited,
    prices,
    selectedCurrency,
  }
}

@connect(mapStateToProps, null)
class TokenValue extends PureComponent {
  static propTypes = {
    value: PropTypes.instanceOf(Amount),
    symbol: PropTypes.string,
    className: PropTypes.string,
    prefix: PropTypes.string,
    isInvert: PropTypes.bool,
    prices: PropTypes.object,
    selectedCurrency: PropTypes.string,
    isInited: PropTypes.bool,
    noRenderPrice: PropTypes.bool,
    bold: PropTypes.bool,
    style: PropTypes.object,
  }

  getFraction (value: BigNumber) {
    const valueBN = new BigNumber(value)
    const fraction = valueBN.modulo(1)

    if (valueBN.isZero() || fraction.isZero()) {
      return '.00'
    }

    const fractionString = fraction.toString().slice(2)
    return `.${fractionString}`
  }

  renderPrice () {
    const { prices, value, symbol, selectedCurrency, isInited } = this.props
    const price = isInited && prices[ symbol ] && prices[ symbol ][ selectedCurrency ] ? prices[ symbol ][ selectedCurrency ] : null
    if (price === null || price === 0) {
      return null
    }
    const valueInCurrency = integerWithDelimiter(value.mul(price), true)
    return (
      <span styleName='price'>{`(US$${valueInCurrency})`}</span>
    )
  }

  render () {
    const { value, isInvert, symbol, prefix, noRenderPrice, style } = this.props
    const defaultMod = isInvert ? 'defaultInvert' : 'default'
    return !value.isLoaded()
      ? <Preloader small />
      : (
        <span styleName={defaultMod} className='TokenValue__root' style={style}>
          {prefix}
          <span styleName='integral' className='TokenValue__integral'>{integerWithDelimiter(value)}</span>
          <span styleName='fraction' className='TokenValue__fraction'>{this.getFraction(value)} {symbol}</span>
          {!noRenderPrice && this.renderPrice()}
        </span>
      )
  }
}

export default TokenValue
