/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import PropTypes from 'prop-types'
import { Translate } from 'react-redux-i18n'
import React, { PureComponent } from 'react'
import { tokensCountSelector } from '@chronobank/core/redux/wallets/selectors/balances'
import { PTWallet } from '@chronobank/core/redux/wallet/types'
import { connect } from 'react-redux'
import { prefix } from './lang'

function makeMapStateToProps (state, ownProps) {
  const { wallet } = ownProps
  let getTokensCount = tokensCountSelector(wallet.id)
  const mapStateToProps = (ownState) => {
    return {
      tokensCount: getTokensCount(ownState),
    }
  }
  return mapStateToProps
}

@connect(makeMapStateToProps)
export default class WalletTokensCount extends PureComponent {
  static propTypes = {
    wallet: PTWallet,
    tokensCount: PropTypes.number,
  }

  render () {
    if (this.props.tokensCount > 1) {
      return <Translate value={`${prefix}.tokensCount`} count={this.props.tokensCount} />
    }
    return null
  }
}
