import TokenModel from '@/models/tokens/TokenModel'
import TokensCollection from '@/models/tokens/TokensCollection'
import { DUCK_TOKENS } from '@/redux/tokens/actions'
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
    tokens: state.get(DUCK_TOKENS),
  }
}

@connect(mapStateToProps, null)
class TokenValue extends PureComponent {
  static propTypes = {
    value: PropTypes.instanceOf(Amount),
    tokens: PropTypes.instanceOf(TokensCollection),
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
    const { prices, value, selectedCurrency, isInited } = this.props
    // TODO @dkchv: remove symbol from props
    const symbol = this.props.symbol || value.symbol()
    const price = isInited && prices[ symbol ] && prices[ symbol ][ selectedCurrency ]
      ? prices[ symbol ][ selectedCurrency ]
      : null
    if (price === null || price === 0) {
      return null
    }
    const valueInCurrency = integerWithDelimiter(value.mul(price), true)
    return (
      <span styleName='price'>{`(US$${valueInCurrency})`}</span>
    )
  }

  render () {
    const { value, isInvert, prefix, noRenderPrice, style } = this.props
    const defaultMod = isInvert ? 'defaultInvert' : 'default'
    const symbol = this.props.symbol || value.symbol()
    const token: TokenModel = this.props.tokens.list().get(symbol)

    console.log('--TokenValue#render', token)

    return !value.isLoaded() || !token
      ? <Preloader small />
      : (
        <span styleName={defaultMod} className='TokenValue__root' style={style}>
          {prefix}
          <span styleName='integral' className='TokenValue__integral'>{integerWithDelimiter(token.removeDecimals(value))}</span>
          <span styleName='fraction' className='TokenValue__fraction'>{this.getFraction(token.removeDecimals(value))} {symbol}</span>
          {!noRenderPrice && this.renderPrice()}
        </span>
      )
  }
}

export default TokenValue
