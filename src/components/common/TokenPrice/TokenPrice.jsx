/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import Amount from '@chronobank/core/models/Amount'
import BigNumber from 'bignumber.js'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { integerWithDelimiter } from 'platform/utils/formatter'
import { priceTokenSelector } from '@chronobank/core/redux/wallet/selectors'

function makeMapStateToProps (state, props) {
  const getBalance = priceTokenSelector(props.value)
  const mapStateToProps = (ownState) => {
    return {
      balance: getBalance(ownState),
    }
  }
  return mapStateToProps
}

@connect(makeMapStateToProps, null)
export default class TokenPrice extends PureComponent {
  static propTypes = {
    value: PropTypes.instanceOf(Amount),
    balance: PropTypes.oneOfType([
      PropTypes.instanceOf(Amount),
      PropTypes.instanceOf(BigNumber),
    ]),
    withFraction: PropTypes.bool,
    fractionPrecision: PropTypes.number,
  }

  static defaultProps = {
    withFraction: false,
    fractionPrecision: 2,
  }

  render () {
    const { balance, withFraction, fractionPrecision } = this.props

    return <span>{integerWithDelimiter(balance, withFraction, fractionPrecision)}</span>
  }
}
