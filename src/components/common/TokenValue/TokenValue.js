/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import BigNumber from 'bignumber.js'
import Preloader from 'components/common/Preloader/Preloader'
import Amount from '@chronobank/core/models/Amount'
import TokenModel from '@chronobank/core/models/tokens/TokenModel'
import TokensCollection from '@chronobank/core/models/tokens/TokensCollection'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { DUCK_MARKET } from '@chronobank/core/redux/market/constants'
import { DUCK_TOKENS } from '@chronobank/core/redux/tokens/constants'
import { integerWithDelimiter } from '@chronobank/core-dependencies/utils/formatter'

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
    precision: PropTypes.number,
    tokens: PropTypes.instanceOf(TokensCollection),
    symbol: PropTypes.string,
    className: PropTypes.string,
    prefix: PropTypes.string,
    isInvert: PropTypes.bool,
    prices: PropTypes.object,
    selectedCurrency: PropTypes.string,
    isInited: PropTypes.bool,
    noRenderPrice: PropTypes.bool,
    renderOnlyPrice: PropTypes.bool,
    onlyPriceValue: PropTypes.bool,
    noRenderSymbol: PropTypes.bool,
    bold: PropTypes.bool,
    style: PropTypes.object,
  }

  getFraction (value: BigNumber) {
    const valueBN = new BigNumber(value).absoluteValue()
    const fraction = valueBN.modulo(1)

    if (valueBN.isZero() || fraction.isZero()) {
      return '.00'
    }

    let fractionString = fraction.toString().slice(2)
    if (this.props.precision && fractionString.length > this.props.precision) {
      fractionString = Math.round(fractionString.slice(0, this.props.precision + 1) / 10)
    }

    return `.${fractionString}`
  }

  renderPrice (valueWithoutDecimals, symbol) {
    const { prices, selectedCurrency, isInited } = this.props
    const price = isInited && prices[symbol] && prices[symbol][selectedCurrency]
      ? prices[symbol][selectedCurrency]
      : null
    if (price === null || price === 0) {
      return this.props.onlyPriceValue ? '0.00' : null
    }
    const valueInCurrency = integerWithDelimiter(valueWithoutDecimals.mul(price), true)
    if (this.props.onlyPriceValue) {
      return valueInCurrency
    }

    return <span styleName='price'>{`USD ${valueInCurrency}`}</span>
  }

  render () {
    const { value, isInvert, prefix, noRenderPrice, style, renderOnlyPrice, noRenderSymbol } = this.props
    const defaultMod = isInvert ? 'defaultInvert' : 'default'

    // TODO @dkchv: remove symbol from props!!!!
    const symbol = this.props.symbol || value.symbol()
    const token: TokenModel = this.props.tokens.item(symbol)
    const valueWithoutDecimals = token.removeDecimals(value)

    if (renderOnlyPrice) {
      return this.renderPrice(valueWithoutDecimals, symbol)
    }
    return !value.isLoaded() || !token.isFetched()
      ? <Preloader small />
      : (
        <span styleName={defaultMod} className='TokenValue__root' style={style}>
          {prefix}
          <span styleName='integral' className='TokenValue__integral'>{!noRenderSymbol && symbol} {integerWithDelimiter(valueWithoutDecimals)}</span>
          <span styleName='integral' className='TokenValue__fraction'>{this.getFraction(valueWithoutDecimals)}</span>
          {!noRenderPrice && this.renderPrice(valueWithoutDecimals, symbol)}
        </span>
      )
  }
}

export default TokenValue
