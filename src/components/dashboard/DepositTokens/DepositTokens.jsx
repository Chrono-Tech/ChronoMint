/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import Amount from '@chronobank/core/models/Amount'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { depositAsset, initAssetsHolder, withdrawAsset } from '@chronobank/core/redux/assetsHolder/actions'
import {
  ACTION_APPROVE,
  ACTION_DEPOSIT,
  ACTION_WITHDRAW,
} from 'components/constants'
import { mainApprove } from '@chronobank/core/redux/mainWallet/actions'
import DepositTokensForm from './DepositTokensForm'
import './DepositTokensForm.scss'

function mapDispatchToProps (dispatch) {
  return {
    initAssetsHolder: () => dispatch(initAssetsHolder()),
    mainApprove: (token, amount, spender, feeMultiplier, advancedOptions) => dispatch(mainApprove(token, amount, spender, feeMultiplier, advancedOptions)),
    depositAsset: (amount, token) => dispatch(depositAsset(amount, token)),
    withdrawAsset: (amount, token) => dispatch(withdrawAsset(amount, token)),
  }
}

@connect(null, mapDispatchToProps)
export default class DepositTokens extends PureComponent {
  static propTypes = {
    initAssetsHolder: PropTypes.func,
    mainApprove: PropTypes.func,
    depositAsset: PropTypes.func,
    withdrawAsset: PropTypes.func,
  }

  componentWillMount () {
    this.props.initAssetsHolder()
  }

  handleSubmit = (values) => {
    const token = values.get('token')
    const amount = new Amount(token.addDecimals(values.get('amount')), token.id())

    switch (values.get('action')) {
      case ACTION_APPROVE:
        this.props.mainApprove(token, amount, values.get('spender'), undefined, {
          skipSlider: true,
        })
        break
      case ACTION_DEPOSIT:
        this.props.depositAsset(amount, token)
        break
      case ACTION_WITHDRAW:
        this.props.withdrawAsset(amount, token)
        break
    }
  }

  handleSubmitSuccess = () => {
    // reset form here
  }

  render () {
    return (
      <DepositTokensForm
        onSubmit={this.handleSubmit}
        onSubmitSuccess={this.handleSubmitSuccess}
      />
    )
  }
}
