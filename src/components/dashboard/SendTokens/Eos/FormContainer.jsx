/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import TokensCollection from '@chronobank/core/models/tokens/TokensCollection'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { mainTransfer } from '@chronobank/core/redux/wallets/actions'
import { multisigTransfer } from '@chronobank/core/redux/multisigWallet/actions'
import { DUCK_TOKENS } from '@chronobank/core/redux/tokens/constants'
import WalletModel from '@chronobank/core/models/wallet/WalletModel'
import TokenModel from '@chronobank/core/models/tokens/TokenModel'
import { MultisigEthWalletModel } from '@chronobank/core/models'
import EosForm from './Form'

function mapStateToProps (state) {
  return {
    tokens: state.get(DUCK_TOKENS),
  }
}

function mapDispatchToProps (dispatch) {
  return {
    multisigTransfer: (wallet, token, amount, recipient, feeMultiplier) => dispatch(multisigTransfer(wallet, token, amount, recipient, feeMultiplier)),
    mainTransfer: (wallet, token, amount, recipient, feeMultiplier, advancedModeParams) => dispatch(mainTransfer(wallet, token, amount, recipient, feeMultiplier, advancedModeParams)),
  }
}

@connect(mapStateToProps, mapDispatchToProps)
export default class SendTokens extends PureComponent {
  static propTypes = {
    wallet: PropTypes.oneOfType([PropTypes.instanceOf(WalletModel), PropTypes.instanceOf(MultisigEthWalletModel)]),
    isModal: PropTypes.bool,
    mainTransfer: PropTypes.func,
    multisigTransfer: PropTypes.func,
    tokens: PropTypes.instanceOf(TokensCollection),
    token: PropTypes.instanceOf(TokenModel),
  }

  handleSubmit = (/*values*/) => {
    // const { wallet } = this.props
    // TODO Implement transfer action
    // const { action, symbol, amount, recipient, feeMultiplier, gweiPerGas, gasLimit, mode } = values.toJS()
    // let advancedModeParams = {
    //   mode,
    // }
    // this.props.mainTransfer(wallet, token, value, recipient, feeMultiplier, advancedModeParams)
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
