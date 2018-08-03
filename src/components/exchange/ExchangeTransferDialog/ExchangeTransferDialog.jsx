/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import ModalDialog from 'components/dialogs/ModalDialog'
import ExchangeOrderModel from '@chronobank/core/models/exchange/ExchangeOrderModel'
import TokenModel from '@chronobank/core/models/tokens/TokenModel'
import MainWallet from '@chronobank/core/models/wallet/MainWalletModel'
import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import { Translate } from 'react-redux-i18n'
import { withdrawFromExchange } from '@chronobank/core/redux/exchange/actions'
import { mainTransfer } from '@chronobank/core/redux/mainWallet/actions'
import TokensCollection from '@chronobank/core/models/tokens/TokensCollection'
import Amount from '@chronobank/core/models/Amount'
import { modalsClose } from 'redux/modals/actions'
import { DUCK_TOKENS } from '@chronobank/core/redux/tokens/constants'
import { getMainEthWallet } from '@chronobank/core/redux/wallets/selectors/models'
import {
  FORM_EXCHANGE_DEPOSIT_FORM,
  FORM_EXCHANGE_WITHDRAWAL_FORM,
} from 'components/constants'
import ExchangeDepositForm from './ExchangeDepositForm'
import './ExchangeTransferDialog.scss'

function prefix (token) {
  return `components.exchange.ExchangeTransferDialog.${token}`
}

function mapDispatchToProps (dispatch) {
  return {
    handleClose: () => dispatch(modalsClose()),
    depositToExchange: (token: TokenModel, amount: string, recipient: string) => dispatch(mainTransfer(null, token, amount, recipient)),
    withdrawFromExchange: (exchange: ExchangeOrderModel, wallet, amount: string, symbol: string) => {
      dispatch(withdrawFromExchange(exchange, wallet, amount, symbol))
    },
  }
}

function mapStateToProps (state) {
  const tokens = state.get(DUCK_TOKENS)
  return {
    userWallet: getMainEthWallet(state),
    tokens,
  }
}

@connect(mapStateToProps, mapDispatchToProps)
export default class ExchangeTransferDialog extends React.PureComponent {
  static propTypes = {
    exchange: PropTypes.instanceOf(ExchangeOrderModel),
    handleClose: PropTypes.func,
    tokenSymbol: PropTypes.string,
    userWallet: PropTypes.instanceOf(MainWallet),
    dispatch: PropTypes.func,
    depositToExchange: PropTypes.func,
    withdrawFromExchange: PropTypes.func,
    tokens: PropTypes.instanceOf(TokensCollection),
  }

  handleDeposit = (values, dispatch, props) => {
    this.props.handleClose()
    this.props.depositToExchange(
      props.token,
      new Amount(props.token.addDecimals(values.get('amount')), props.token.symbol()),
      this.props.exchange.address(),
    )
  }

  handleWithdrawal = (values, dispatch, props) => {
    this.props.handleClose()
    this.props.withdrawFromExchange(
      this.props.exchange,
      this.props.userWallet,
      new Amount(props.token.addDecimals(values.get('amount')), props.token.symbol()),
      props.token.symbol(),
    )
  }

  render () {
    let token = this.props.tokens.getBySymbol(this.props.tokenSymbol)
    let showMessage = false

    let amount = this.props.userWallet.balances().item(token.id()).amount()
    if (!amount.isLoaded()) {
      showMessage = true
      amount = new Amount('0', token.symbol())
    }

    const assetBalance = this.props.tokenSymbol === 'ETH'
      ? new Amount(this.props.exchange.ethBalance(), 'ETH')
      : new Amount(this.props.exchange.assetBalance(), this.props.exchange.symbol())

    return (
      <ModalDialog title={<span><Translate value={prefix(`title`)} />{` ${this.props.tokenSymbol} `}</span>}>
        <div styleName='root'>
          <div styleName='content'>
            {
              showMessage &&
              <div styleName='warningMessage'>
                <i className='material-icons'>warning</i>
                <Translate value={prefix('needToCreateWallet')} symbol={this.props.tokenSymbol} />
              </div>
            }
            <ExchangeDepositForm
              title={<span><Translate value={prefix('deposit')} /> {this.props.tokenSymbol}</span>}
              form={FORM_EXCHANGE_DEPOSIT_FORM}
              onSubmit={this.handleDeposit}
              maxAmount={amount}
              token={token}
            />
            <ExchangeDepositForm
              title={<span><Translate value={prefix('withdrawal')} /> {this.props.tokenSymbol}</span>}
              form={FORM_EXCHANGE_WITHDRAWAL_FORM}
              onSubmit={this.handleWithdrawal}
              maxAmount={assetBalance}
              token={token}
            />
          </div>
        </div>
      </ModalDialog>
    )
  }
}

