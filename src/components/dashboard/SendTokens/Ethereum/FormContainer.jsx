/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import Amount from '@chronobank/core/models/Amount'
import TokensCollection from '@chronobank/core/models/tokens/TokensCollection'
import PropTypes from 'prop-types'
import BigNumber from 'bignumber.js'
import web3Converter from '@chronobank/core/utils/Web3Converter'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { mainApprove, mainTransfer } from '@chronobank/core/redux/wallets/actions'
import { multisigTransfer } from '@chronobank/core/redux/multisigWallet/actions'
import { DUCK_TOKENS } from '@chronobank/core/redux/tokens/constants'
import WalletModel from '@chronobank/core/models/wallet/WalletModel'
import TokenModel from '@chronobank/core/models/tokens/TokenModel'
import { MultisigEthWalletModel } from '@chronobank/core/models'
import {
  ACTION_APPROVE,
  ACTION_TRANSFER,
  MODE_ADVANCED,
  MODE_SIMPLE,
} from 'components/constants'
import EthereumForm from './Form'

function mapStateToProps (state, props) {
  const token = state.get(DUCK_TOKENS).item(props.tokenSymbol)

  return {
    tokens: state.get(DUCK_TOKENS),
    token,
  }
}

function mapDispatchToProps (dispatch) {
  return {
    multisigTransfer: (wallet, token, amount, recipient, feeMultiplier) => dispatch(multisigTransfer(wallet, token, amount, recipient, feeMultiplier)),
    mainApprove: (token, amount, spender, feeMultiplier) => dispatch(mainApprove(token, amount, spender, feeMultiplier)),
    mainTransfer: (wallet, token, amount, recipient, feeMultiplier, advancedModeParams) => dispatch(mainTransfer(wallet, token, amount, recipient, feeMultiplier, advancedModeParams)),
  }
}

@connect(mapStateToProps, mapDispatchToProps)
export default class SendTokens extends PureComponent {
  static propTypes = {
    wallet: PropTypes.oneOfType([PropTypes.instanceOf(WalletModel), PropTypes.instanceOf(MultisigEthWalletModel)]),
    isModal: PropTypes.bool,
    mainApprove: PropTypes.func,
    mainTransfer: PropTypes.func,
    multisigTransfer: PropTypes.func,
    tokens: PropTypes.instanceOf(TokensCollection),
    tokenSymbol: PropTypes.string.isRequired,
    token: PropTypes.instanceOf(TokenModel),
  }

  handleSubmit = (values, formState) => {
    const { wallet, tokens } = this.props

    const { action, symbol, amount, recipient, feeMultiplier, gweiPerGas, gasLimit, mode } = values.toJS()
    let advancedModeParams = {
      mode,
    }

    const token = tokens.item(symbol)
    if (mode === MODE_ADVANCED ) {
      const currentGasLimit = gasLimit || formState.gasLimitEstimated
      const gweiPerGasBN = new BigNumber(web3Converter.toWei(gweiPerGas, 'gwei'))
      advancedModeParams = {
        gweiPerGas: gweiPerGasBN,
        gasLimit: currentGasLimit,
        gasFee: gweiPerGasBN.mul(currentGasLimit),
        ...advancedModeParams,
      }
    }

    const value = new Amount(token.addDecimals(amount), symbol)

    switch (action) {
      case ACTION_APPROVE:
        !wallet.isMultisig && this.props.mainApprove(token, value, recipient, feeMultiplier)
        break
      case ACTION_TRANSFER:
        wallet.isMultisig
          ? this.props.multisigTransfer(wallet, token, value, recipient, feeMultiplier, advancedModeParams)
          : this.props.mainTransfer(wallet, token, value, recipient, feeMultiplier, advancedModeParams)
    }
  }

  getInitialValues = (token) => ({
    feeMultiplier: 1,
    symbol: token.symbol(),
    mode: MODE_SIMPLE,
  })

  render () {
    const { token } = this.props

    return (
      <EthereumForm
        initialValues={this.getInitialValues(token)}
        onSubmit={this.handleSubmit}
        token={this.props.token}
        wallet={this.props.wallet}
      />
    )
  }
}
