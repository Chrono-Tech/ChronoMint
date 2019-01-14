/**
 * Copyright 2017–2019, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import Amount from '@chronobank/core/models/Amount'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { mainTransfer } from '@chronobank/core/redux/wallets/actions'
import { DUCK_TOKENS } from '@chronobank/core/redux/tokens/constants'
import WalletModel from '@chronobank/core/models/wallet/WalletModel'
import TokenModel from '@chronobank/core/models/tokens/TokenModel'
import {
  MODE_SIMPLE,
} from 'components/constants'

export const mapStateToProps = (state, props) => ({
  token: state.get(DUCK_TOKENS).item(props.tokenSymbol)
})

export function mapDispatchToProps (dispatch) {
  return {
    mainTransfer: (wallet, token, amount, recipient, feeMultiplier, advancedModeParams) => dispatch(mainTransfer(wallet, token, amount, recipient, feeMultiplier, advancedModeParams)),
  }
}

export default class SendTokens extends PureComponent {
  static propTypes = {
    wallet: PropTypes.oneOfType([PropTypes.instanceOf(WalletModel)]),
    mainTransfer: PropTypes.func,
    tokenSymbol: PropTypes.string.isRequired,
    token: PropTypes.instanceOf(TokenModel),
  }

  handleSubmit = (values) => {
    const formFields = values.toJS()
    const { symbol, amount, recipient, feeMultiplier } = formFields
    const { wallet, token } = this.props
    const value = new Amount(token.addDecimals(amount), symbol)
    this.props.mainTransfer(wallet, token, value, recipient, feeMultiplier, this.getAdvancedParams(formFields))
  }

  getAdvancedParams (formFields) {
    const { mode } = formFields
    return {
      mode,
    }
  }

  render () {
    const { form: Form, token } = this.props

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
