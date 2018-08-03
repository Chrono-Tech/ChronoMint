/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { ModalDialog } from 'components'
import {
  BLOCKCHAIN_BITCOIN,
  BLOCKCHAIN_BITCOIN_CASH,
  BLOCKCHAIN_BITCOIN_GOLD,
  BLOCKCHAIN_LITECOIN,
  BLOCKCHAIN_ETHEREUM,
} from '@chronobank/core/dao/constants'
import Amount from '@chronobank/core/models/Amount'
import TokensCollection from '@chronobank/core/models/tokens/TokensCollection'
import PropTypes from 'prop-types'
import BigNumber from 'bignumber.js'
import web3Converter from '@chronobank/core/utils/Web3Converter'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { change, untouch } from 'redux-form'
import { mainApprove, mainTransfer } from '@chronobank/core/redux/mainWallet/actions'
import { multisigTransfer } from '@chronobank/core/redux/multisigWallet/actions'
import { estimateGas } from '@chronobank/core/redux/tokens/actions'
import { DUCK_TOKENS } from '@chronobank/core/redux/tokens/constants'
import WalletModel from '@chronobank/core/models/wallet/WalletModel'
import {
  ACTION_APPROVE,
  ACTION_TRANSFER,
  FORM_SEND_TOKENS,
  MODE_ADVANCED,
  MODE_SIMPLE,
} from 'components/constants'
import SendTokensForm from './SendTokensForm'

function mapStateToProps (state) {
  return {
    tokens: state.get(DUCK_TOKENS),
  }
}

function mapDispatchToProps (dispatch) {
  return {
    multisigTransfer: (wallet, token, amount, recipient, feeMultiplier) => dispatch(multisigTransfer(wallet, token, amount, recipient, feeMultiplier)),
    mainApprove: (token, amount, spender, feeMultiplier) => dispatch(mainApprove(token, amount, spender, feeMultiplier)),
    mainTransfer: (wallet, token, amount, recipient, feeMultiplier, advancedModeParams) => dispatch(mainTransfer(wallet, token, amount, recipient, feeMultiplier, advancedModeParams)),
    estimateGas: (tokenId, params, callback, gasPriceMultiplier) => dispatch(estimateGas(tokenId, params, callback, gasPriceMultiplier)),
    resetForm: () => {
      dispatch(change(FORM_SEND_TOKENS, 'recipient', ''))
      dispatch(change(FORM_SEND_TOKENS, 'amount', ''))
      dispatch(untouch(FORM_SEND_TOKENS, 'recipient', 'amount'))
    },
  }
}

@connect(mapStateToProps, mapDispatchToProps)
export default class SendTokens extends PureComponent {
  static propTypes = {
    wallet: PropTypes.instanceOf(WalletModel),
    isModal: PropTypes.bool,
    mainApprove: PropTypes.func,
    mainTransfer: PropTypes.func,
    resetForm: PropTypes.func,
    multisigTransfer: PropTypes.func,
    tokens: PropTypes.instanceOf(TokensCollection),
    token: PropTypes.string,
    blockchain: PropTypes.string,
    address: PropTypes.string,
  }

  handleSubmit = (values, formState) => {
    const { wallet, tokens } = this.props

    const { action, symbol, amount, recipient, feeMultiplier, gweiPerGas, satPerByte, gasLimit, mode } = values.toJS()
    let advancedModeParams = {
      mode,
    }

    const currentGasLimit = gasLimit || formState.gasLimitEstimated

    const token = tokens.item(symbol)
    if (mode === MODE_ADVANCED && token.blockchain() === BLOCKCHAIN_ETHEREUM) {
      const gweiPerGasBN = new BigNumber(web3Converter.toWei(gweiPerGas, 'gwei'))
      advancedModeParams = {
        gweiPerGas: gweiPerGasBN,
        gasLimit: currentGasLimit,
        gasFee: gweiPerGasBN.mul(currentGasLimit),
        ...advancedModeParams,
      }
    }

    if (mode === MODE_ADVANCED && this.isBTCLikeBlockchain(token.blockchain())) {
      advancedModeParams = {
        satPerByte: satPerByte,
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

  handleSubmitSuccess = () => {
    // this.props.resetForm()
  }

  isBTCLikeBlockchain = (blockchain) => {
    return [
      BLOCKCHAIN_BITCOIN,
      BLOCKCHAIN_BITCOIN_CASH,
      BLOCKCHAIN_BITCOIN_GOLD,
      BLOCKCHAIN_LITECOIN,
    ].includes(blockchain)
  }

  render () {
    const { isModal, token } = this.props
    const initialValues = {
      feeMultiplier: 1,
      symbol: token,
      mode: MODE_SIMPLE,
    }

    if (isModal) {
      return (
        <ModalDialog>
          <SendTokensForm
            initialValues={initialValues}
            onSubmit={this.handleSubmit}
            onSubmitSuccess={this.handleSubmitSuccess}
            token={this.props.token}
            wallet={this.props.wallet}
          />
        </ModalDialog>
      )
    }

    return (
      <SendTokensForm
        initialValues={initialValues}
        onSubmit={this.handleSubmit}
        onSubmitSuccess={this.handleSubmitSuccess}
        token={this.props.token}
        wallet={this.props.wallet}
      />
    )
  }
}
