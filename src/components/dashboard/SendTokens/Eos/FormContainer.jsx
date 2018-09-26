/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { DUCK_TOKENS } from '@chronobank/core/redux/tokens/constants'
import WalletModel from '@chronobank/core/models/wallet/WalletModel'
import { executeEosTransaction } from '@chronobank/core/redux/eos/thunks'
import { MultisigEthWalletModel } from '@chronobank/core/models'
import EosForm from './Form'

function mapStateToProps (state) {
  return {
    tokens: state.get(DUCK_TOKENS),
  }
}

function mapDispatchToProps (dispatch) {
  return {
    transfer: (wallet, amount, recipient) => dispatch(executeEosTransaction(wallet, amount, recipient)),
  }
}

@connect(mapStateToProps, mapDispatchToProps)
export default class SendTokens extends PureComponent {
  static propTypes = {
    wallet: PropTypes.oneOfType([PropTypes.instanceOf(WalletModel), PropTypes.instanceOf(MultisigEthWalletModel)]),
    isModal: PropTypes.bool,
    transfer: PropTypes.func,
  }

  handleSubmit = (values) => {
    const { wallet } = this.props
    const { symbol, amount, recipient } = values.toJS()
    this.props.transfer(wallet, `${parseFloat(amount).toFixed(4)} ${symbol}`, recipient)
  }

  render () {
    return (
      <EosForm
        onSubmit={this.handleSubmit}
        token={this.props.token}
        wallet={this.props.wallet}
      />
    )
  }
}
