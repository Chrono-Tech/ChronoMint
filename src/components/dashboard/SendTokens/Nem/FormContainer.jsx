/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import PropTypes from 'prop-types'
import Amount from '@chronobank/core/models/Amount'
import TokensCollection from '@chronobank/core/models/tokens/TokensCollection'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { mainTransfer } from '@chronobank/core/redux/wallets/actions'
import { DUCK_TOKENS } from '@chronobank/core/redux/tokens/constants'
import WalletModel from '@chronobank/core/models/wallet/WalletModel'
import TokenModel from '@chronobank/core/models/tokens/TokenModel'
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
    mainTransfer: (wallet, token, amount, recipient) => dispatch(mainTransfer(wallet, token, amount, recipient)),
  }
}

@connect(mapStateToProps, mapDispatchToProps)
export default class SendTokens extends PureComponent {
  static propTypes = {
    wallet: PropTypes.oneOfType([PropTypes.instanceOf(WalletModel)]),
    isModal: PropTypes.bool,
    mainApprove: PropTypes.func,
    mainTransfer: PropTypes.func,
    multisigTransfer: PropTypes.func,
    tokens: PropTypes.instanceOf(TokensCollection),
    tokenSymbol: PropTypes.string.isRequired,
    token: PropTypes.instanceOf(TokenModel),
  }

  handleSubmit = (values) => {
    const { wallet, token } = this.props
    const { symbol, amount, recipient, feeMultiplier } = values.toJS()

    const value = new Amount(token.addDecimals(amount), symbol)
    this.props.mainTransfer(wallet, token, value, recipient, feeMultiplier)
  }

  render () {
    const { token } = this.props

    const initialValues = {
      symbol: token.symbol(),
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
