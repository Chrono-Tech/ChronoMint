/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import Amount from '@chronobank/core/models/Amount'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { integerWithDelimiter } from '@chronobank/core-dependencies/utils/formatter'
import { priceTokenSelector } from '@chronobank/core/redux/wallet/selectors'
import { getToken } from '@chronobank/core/redux/locs/selectors'
import TokenModel from '@chronobank/core/models/tokens/TokenModel'

function makeMapStateToProps (state, props) {
  const getPrice = priceTokenSelector(props.value)
  const mapStateToProps = (ownState) => {
    return {
      price: getPrice(ownState),
      token: getToken(props.value.symbol())(ownState),
    }
  }
  return mapStateToProps
}

@connect(makeMapStateToProps, null)
export default class TokenPrice extends PureComponent {
  static propTypes = {
    value: PropTypes.instanceOf(Amount),
    price: PropTypes.number,
    withFraction: PropTypes.bool,
    fractionPrecision: PropTypes.number,
    isRemoveDecimals: PropTypes.bool,
    token: PropTypes.instanceOf(TokenModel),
  }

  static defaultProps = {
    withFraction: false,
    fractionPrecision: 2,
  }

  render () {
    const { price, withFraction, fractionPrecision, isRemoveDecimals, token, value } = this.props
    let valueWithoutDecimals
    if (token.isFetched() && isRemoveDecimals) {
      valueWithoutDecimals = token.removeDecimals(value)
    }

    return <span>{integerWithDelimiter((valueWithoutDecimals || value).mul((price || 0)), withFraction, fractionPrecision)}</span>
  }
}
