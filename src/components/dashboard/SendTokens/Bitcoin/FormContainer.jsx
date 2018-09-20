/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import Amount from '@chronobank/core/models/Amount'
import TokensCollection from '@chronobank/core/models/tokens/TokensCollection'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { mainTransfer } from '@chronobank/core/redux/wallets/actions'
import { DUCK_TOKENS } from '@chronobank/core/redux/tokens/constants'
import WalletModel from '@chronobank/core/models/wallet/WalletModel'
import TokenModel from '@chronobank/core/models/tokens/TokenModel'
import {
  MODE_SIMPLE,
} from 'components/constants'
import Form from './Form'

function mapStateToProps (state, props) {
  const token = state.get(DUCK_TOKENS).item(props.tokenSymbol)

  return {
    tokens: state.get(DUCK_TOKENS),
    token,
  }
}

function mapDispatchToProps (dispatch) {
  return {
    mainTransfer: (wallet, token, amount, recipient, feeMultiplier, advancedModeParams) => dispatch(mainTransfer(wallet, token, amount, recipient, feeMultiplier, advancedModeParams)),
  }
}

@connect(mapStateToProps, mapDispatchToProps)
export default class SendTokens extends PureComponent {
  static propTypes = {
    wallet: PropTypes.oneOfType([PropTypes.instanceOf(WalletModel)]),
    isModal: PropTypes.bool,
    mainTransfer: PropTypes.func,
    tokens: PropTypes.instanceOf(TokensCollection),
    tokenSymbol: PropTypes.string.isRequired,
    token: PropTypes.instanceOf(TokenModel),
  }

  handleSubmit = (values) => {
    const { wallet, token } = this.props
    const { symbol, amount, recipient, feeMultiplier, mode } = values.toJS()
    const advancedModeParams = {
      mode,
    }

    const value = new Amount(token.addDecimals(amount), symbol)
    this.props.mainTransfer(wallet, token, value, recipient, feeMultiplier, advancedModeParams)
  }

  render () {
    const { token } = this.props

    const initialValues = {
      feeMultiplier: 1,
      symbol: token.symbol(),
      mode: MODE_SIMPLE,
    }

    return (
      <Form
        initialValues={initialValues}
        onSubmit={this.handleSubmit}
        token={this.props.token}
        wallet={this.props.wallet}
      />
    )
  }
}
