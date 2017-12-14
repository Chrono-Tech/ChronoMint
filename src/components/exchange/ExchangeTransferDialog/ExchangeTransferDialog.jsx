import ModalDialog from 'components/dialogs/ModalDialog'
import ExchangeOrderModel from 'models/exchange/ExchangeOrderModel'
import TokenModel from 'models/TokenModel'
import MainWallet from 'models/wallet/MainWalletModel'
import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import { Translate } from 'react-redux-i18n'
import { DUCK_EXCHANGE, withdrawFromExchange } from 'redux/exchange/actions'
import { DUCK_MAIN_WALLET, mainTransfer } from 'redux/mainWallet/actions'
import TokensCollection from 'models/exchange/TokensCollection'
import { modalsClose } from 'redux/modals/actions'
import ExchangeDepositForm from './ExchangeDepositForm'
import './ExchangeTransferDialog.scss'

export const FORM_EXCHANGE_DEPOSIT_FORM = 'ExchangeDepositForm'
export const FORM_EXCHANGE_WITHDRAWAL_FORM = 'ExchangeWithdrawalForm'

function prefix (token) {
  return `components.exchange.ExchangeTransferDialog.${token}`
}

function mapDispatchToProps (dispatch) {
  return {
    handleClose: () => dispatch(modalsClose()),
    depositToExchange: (token: TokenModel, amount: string, recipient: string) => dispatch(mainTransfer(token, amount, recipient)),
    withdrawFromExchange: (exchange: ExchangeOrderModel, wallet, amount: string, symbol: string) => {
      dispatch(withdrawFromExchange(exchange, wallet, amount, symbol))
    },
  }
}

function mapStateToProps (state) {
  const exchange = state.get(DUCK_EXCHANGE)
  return {
    userWallet: state.get(DUCK_MAIN_WALLET),
    tokens: exchange.tokens(),
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
      this.props.userWallet.tokens().get(props.symbol),
      values.get('amount'),
      this.props.exchange.address(),
    )
  }

  handleWithdrawal = (values, dispatch, props) => {
    this.props.handleClose()
    this.props.withdrawFromExchange(
      this.props.exchange,
      this.props.userWallet,
      values.get('amount'),
      props.symbol,
    )
  }

  render () {
    let token = this.props.userWallet.tokens().get(this.props.tokenSymbol)
    let showMessage = false

    if (!token) {
      token = this.props.tokens.getBySymbol(this.props.tokenSymbol)
      showMessage = true
    }

    return (
      <ModalDialog>
        <div styleName='root'>
          <div styleName='header'>
            <div styleName='headerWrapper'>
              <div styleName='title'>
                <Translate
                  value={prefix(`title`)}
                />{` ${this.props.tokenSymbol} `}
              </div>
            </div>
          </div>
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
              maxAmount={token ? token.balance() : 0}
              symbol={token.symbol()}
            />
            <ExchangeDepositForm
              title={<span><Translate value={prefix('withdrawal')} /> {this.props.tokenSymbol}</span>}
              form={FORM_EXCHANGE_WITHDRAWAL_FORM}
              onSubmit={this.handleWithdrawal}
              maxAmount={this.props.tokenSymbol === 'ETH' ? this.props.exchange.ethBalance() : this.props.exchange.assetBalance()}
              symbol={this.props.tokenSymbol}
            />
          </div>
        </div>
      </ModalDialog>
    )
  }
}

