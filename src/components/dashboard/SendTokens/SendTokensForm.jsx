/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { Button, IPFSImage } from 'components'
import { BLOCKCHAIN_BITCOIN, BLOCKCHAIN_BITCOIN_CASH, BLOCKCHAIN_BITCOIN_GOLD, BLOCKCHAIN_LITECOIN } from '@chronobank/login/network/BitcoinProvider'
import { TOKEN_ICONS } from 'assets'
import WalletMainSVG from 'assets/img/icn-wallet-main.svg'
import WalletMultiSVG from 'assets/img/icn-wallet-multi.svg'
import Moment from 'components/common/Moment'
import Preloader from 'components/common/Preloader/Preloader'
import TokenValue from 'components/common/TokenValue/TokenValue'
import ColoredSection from 'components/dashboard/ColoredSection/ColoredSection'
import IconSection from 'components/dashboard/IconSection/IconSection'
import contractsManagerDAO from 'dao/ContractsManagerDAO'
import { BLOCKCHAIN_ETHEREUM } from 'dao/EthereumDAO'
import { btcProvider } from '@chronobank/login/network/BitcoinProvider'
import Amount from 'models/Amount'
import Immutable from 'immutable'
import { MenuItem, MuiThemeProvider, Paper } from 'material-ui'
import BalanceModel from 'models/tokens/BalanceModel'
import TokenModel from 'models/tokens/TokenModel'
import AllowanceModel from 'models/wallet/AllowanceModel'
import MainWallet from 'models/wallet/MainWalletModel'
import MultisigWalletModel from 'models/wallet/MultisigWalletModel'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { Translate } from 'react-redux-i18n'
import { SelectField, Slider, TextField, Checkbox } from 'redux-form-material-ui'
import { change, Field, formPropTypes, formValueSelector, reduxForm } from 'redux-form/immutable'
import { DUCK_MAIN_WALLET, getSpendersAllowance } from 'redux/mainWallet/actions'
import { DUCK_SESSION } from 'redux/session/actions'
import { BALANCES_COMPARATOR_SYMBOL, getGasPriceMultiplier, getVisibleBalances } from 'redux/session/selectors'
import { DUCK_TOKENS } from 'redux/tokens/actions'
import { getCurrentWallet } from 'redux/wallet/actions'
import inversedTheme from 'styles/themes/inversed'
import styles from '../styles'
import { prefix } from './lang'
import './SendTokensForm.scss'
import validate from './validate'

export const FORM_SEND_TOKENS = 'FormSendTokens'

export const MODE_SIMPLE = 'simple'
export const MODE_ADVANCED = 'advanced'

export const ACTION_TRANSFER = 'action/transfer'
export const ACTION_APPROVE = 'action/approve'

const FEE_RATE_MULTIPLIER = {
  min: 0.1,
  max: 1.9,
  step: 0.1,
}

function mapStateToProps (state) {
  const wallet: MainWallet = state.get(DUCK_MAIN_WALLET)
  const selector = formValueSelector(FORM_SEND_TOKENS)
  const tokenId = selector(state, 'symbol')
  const feeMultiplier = selector(state, 'feeMultiplier')
  const recipient = selector(state, 'recipient')
  const symbol = selector(state, 'symbol')
  const amount = selector(state, 'amount')
  const satPerByte = selector(state, 'satPerByte')
  const token = state.get(DUCK_TOKENS).item(tokenId)

  return {
    wallet,
    visibleBalances: getVisibleBalances(BALANCES_COMPARATOR_SYMBOL)(state),
    tokens: state.get(DUCK_TOKENS),
    balance: getCurrentWallet(state).balances().item(tokenId).amount(),
    allowance: wallet.allowances().item(recipient, tokenId),
    account: state.get(DUCK_SESSION).account,
    amount,
    token,
    recipient,
    symbol,
    feeMultiplier,
    satPerByte,
    gasPriceMultiplier: getGasPriceMultiplier(token.blockchain())(state),
  }
}

@connect(mapStateToProps, null)
@reduxForm({ form: FORM_SEND_TOKENS, validate })
export default class SendTokensForm extends PureComponent {
  static propTypes = {
    account: PropTypes.string,
    wallet: PropTypes.oneOfType([
      PropTypes.instanceOf(MainWallet),
      PropTypes.instanceOf(MultisigWalletModel),
    ]),
    visibleBalances: PropTypes.arrayOf(
      PropTypes.instanceOf(BalanceModel),
    ),
    allowance: PropTypes.instanceOf(AllowanceModel),
    recipient: PropTypes.string,
    token: PropTypes.instanceOf(TokenModel),
    feeMultiplier: PropTypes.number,
    transfer: PropTypes.func,
    onTransfer: PropTypes.func,
    onApprove: PropTypes.func,
    gasPriceMultiplier: PropTypes.number,
    ...formPropTypes,
  }

  constructor () {
    super(...arguments)
    this.state = {
      isContract: false,
      mode: MODE_SIMPLE,
      advancedFee: 0
    }
  }

  componentWillReceiveProps (newProps) {
    if (newProps.token.address() !== this.props.token.address()) {
      this.checkIsContract(newProps.token.address())
        .then((result) => {
          this.setState({
            isContract: result,
          })
        })
    }

    if ((newProps.token.address() !== this.props.token.address() || newProps.recipient !== this.props.recipient) && newProps.token.isERC20()) {
      this.props.dispatch(getSpendersAllowance(newProps.token.id(), newProps.recipient))
    }

    const firstBalance = newProps.visibleBalances.length && newProps.visibleBalances[ 0 ]
    const isRelevant = newProps.visibleBalances.find((balance) => balance.id() === newProps.token.id())
    if (!(isRelevant && newProps.token.isFetched()) && firstBalance) {
      this.props.dispatch(change(FORM_SEND_TOKENS, 'symbol', firstBalance.id()))
    }

    if (newProps.gasPriceMultiplier !== this.props.gasPriceMultiplier && newProps.token.blockchain() === BLOCKCHAIN_ETHEREUM) {
      this.props.dispatch(change(FORM_SEND_TOKENS, 'feeMultiplier', newProps.gasPriceMultiplier))
    }
  }

  handleTransfer = (values) => {
    this.props.onSubmit(values.set('action', ACTION_TRANSFER))
  }

  handleApprove = (values) => {
    if (this.props.allowance.amount().gt(0)) {
      values = values.set('amount', 0)
    }
    this.props.onSubmit(values.set('action', ACTION_APPROVE))
  }

  handleRevoke = () => {
    this.props.onSubmit(new Immutable.Map({
      action: ACTION_APPROVE,
      symbol: this.props.token.symbol(),
      amount: 0,
      recipient: this.props.recipient,
    }))
  }

  getFeeTitle () {
    const { token } = this.props

    switch (token.blockchain()) {
      case BLOCKCHAIN_BITCOIN:
      case BLOCKCHAIN_BITCOIN_CASH:
      case BLOCKCHAIN_BITCOIN_GOLD:
      case BLOCKCHAIN_LITECOIN:
        return 'feeRate'
      case BLOCKCHAIN_ETHEREUM:
        return 'gasPrice'
      default:
        return ''
    }
  }

  async getFee(to, from, amount, feeRate) {
    return btcProvider.estimateFee(to, from, amount, feeRate)
  }

  changeMode = () => {
    this.setState({
      mode: this.state.mode === MODE_SIMPLE ? MODE_ADVANCED : MODE_SIMPLE
    })
  }

  checkIsContract (address): Promise {
    return contractsManagerDAO.isContract(address)
  }

  getFormFee = () => {
    return this.state.mode === MODE_SIMPLE ? this.props.feeMultiplier : this.props.satPerByte
  }


  calculatingFeeBitcoin = async (event, value) => {
    const fee = await this.getFee(
      this.props.wallet.addresses().item(this.props.token.blockchain()).address(),
      this.props.recipient,
      new Amount(this.props.amount, this.props.token.symbol()),
      this.getFormFee()
    )

    return fee
  }

  calculatingFeeERC20 = async (event, value) => {


    return 0
  }

  calculatingFee = async (event, value) => {
    console.log('calculatingFee: ', event, value)
    const fee = 0
    if (this.props.token.symbol() === 'BTC') {
      const fee = this.calculatingFeeBitcoin(event, value)
    } else if (this.props.token.isERC20()) {
      const fee = this.calculatingFeeERC20(event, value)
    }

    console.log('calculatingFee: ', this.props.token.symbol(), fee)

    this.setState({
      advancedFee: fee
    })
  }

  renderHead () {
    const { token, visibleBalances, wallet, allowance } = this.props
    const currentBalance = visibleBalances.find((balance) => balance.id() === token.id()) || visibleBalances[ 0 ]

    console.log('head: ', this.props)

    return (
      <div styleName='head'>
        <div styleName='head-token-icon'>
          <IPFSImage
            styleName='content'
            multihash={token.icon()}
            fallback={TOKEN_ICONS[ token.symbol() ]}
          />
        </div>
        <div styleName='head-section'>
          <span styleName='head-section-text'>
            <Translate value='wallet.sendTokens' />
          </span>
        </div>
        <div styleName='wallet-tokens-selector-container'>
          <MuiThemeProvider theme={inversedTheme}>
            {visibleBalances.length === 0
              ? <Preloader />
              : (
                <Field
                  component={SelectField}
                  name='symbol'
                  fullWidth
                  {...styles}
                >
                  {visibleBalances
                    .map((balance) => {
                      const token: TokenModel = this.props.tokens.item(balance.id())
                      if (token.isLocked()) {
                        return
                      }
                      return (
                        <MenuItem
                          key={balance.id()}
                          value={balance.id()}
                          primaryText={balance.symbol()}
                        />
                      )
                    })}
                </Field>
              )
            }
          </MuiThemeProvider>
        </div>
        <div styleName='wallet-name-section'>
          <div styleName='wallet-name-title-section'>
            <span styleName='wallet-name-title'>
              <Translate value='wallet.walletName' />
            </span>
          </div>
          <div styleName='wallet-value'>
            <span styleName='wallet-value'>
              {wallet.addresses().item(token.blockchain()).address()}
            </span>
          </div>
        </div>

        <div styleName='balance'>
          <div styleName='value'>
            <TokenValue precision={6} noRenderPrice isInvert value={currentBalance.amount()} />
          </div>
          <div styleName='value'>
            <span styleName='price-value'>
              <TokenValue isInvert renderOnlyPrice value={allowance.amount()} />
            </span>
          </div>
        </div>
        {token.isERC20() && this.props.allowance &&
        <div styleName='balance'>
          <div styleName='label'>
            <Translate value={`${prefix}.allowance`} />:
            <TokenValue
              isInvert
              value={this.props.allowance.amount()}
            />
          </div>
        </div>
        }
      </div>
    )
  }

  renderBody () {
    const { invalid, pristine, token, handleSubmit, feeMultiplier, wallet, allowance, recipient } = this.props
    const { isContract } = this.state
    const isApprove = allowance.amount().lte(0)
    const isTimeLocked = wallet.isTimeLocked()

    return (
      <div styleName='form-container'>
        <div>
          <Field
            component={TextField}
            name='recipient'
            floatingLabelText={<Translate value={`${prefix}.recipientAddress`} />}
            fullWidth
          />
        </div>
        <div styleName='row'>
            <Field
              component={TextField}
              name='amount'
              floatingLabelText={<Translate value={`${prefix}.amount`} />}
              fullWidth
            />
        </div>
        {!(this.state.mode === MODE_SIMPLE && feeMultiplier && token.feeRate()) ? null : (
          <div styleName='row'>
            <div styleName='feeRate'>
              <Field
                component={Slider}
                sliderStyle={{ marginBottom: 0, marginTop: 5 }}
                name='feeMultiplier'
                {...FEE_RATE_MULTIPLIER}
                onChange={this.calculatingFee}
              />
              <div styleName='tagsWrap'>
                <div><Translate value={`${prefix}.slow`} /></div>
                <div styleName='tagDefault' />
                <div><Translate value={`${prefix}.fast`} /></div>
              </div>
            </div>
          </div>
        )}
        { this.state.mode === MODE_ADVANCED && (
          <div styleName='advanced-mode-container'>
            <div styleName='field'>
              <Field
                component={TextField}
                name='satPerByte'
                floatingLabelText={<Translate value={'wallet.satPerByte'} />}
                fullWidth
                onChange={this.calculatingFee}
              />
            </div>
          </div>
        ) }
        <div styleName="transaction-fee">
                <span styleName='title'>
                  <Translate value={`${prefix}.transactionFee`} />
                </span>
                <span styleName='description'>
                  <Translate value={`${prefix}.transactionFeeDescription`}
                     symbol={this.props.token.symbol()}
                     feeValue={this.state.advancedFee}
                     feeAsUSD={<TokenValue
                       renderOnlyPrice onlyPriceValue  value={new Amount(
                       this.state.advancedFee,
                       this.props.token.symbol())}
                     />}
                     averageFee={'4.5'} />
                </span>
        </div>
        <div styleName='template-container'>
          <div styleName='template-checkbox'>
            <Field
              component={Checkbox}
              name='isTemplateEnabled'
            />
          </div>
          <div styleName='template-name'>
            <Field
              component={TextField}
              name='TemplateName'
              floatingLabelText={<Translate value={'wallet.templateName'} />}
              fullWidth
            />
          </div>
        </div>

        <div styleName='actions-row'>
          <div styleName='advanced-simple'>
            { this.props.token.symbol() === 'BTC' && (<div onTouchTap={this.changeMode}>
              <span styleName='advanced-text'>
                 <Translate value={ this.state.mode === MODE_SIMPLE ? 'wallet.modeAdvanced' : 'wallet.modeSimple' } />
              </span>
            </div>)}
          </div>
          <div styleName='send'>
            <Button
              label={<Translate value={`${prefix}.send`} />}
              disabled={pristine || invalid || isTimeLocked}
              onTouchTap={handleSubmit(this.handleTransfer)}
            />
          </div>
        </div>
      </div>
    )
  }

  render () {
    const { visibleBalances } = this.props

    console.log(this.props)

    return !visibleBalances.length ? null : (
      <Paper>
        <form onSubmit={this.props.handleSubmit}>
          {this.renderHead()}
          {this.renderBody()}
        </form>
      </Paper>
    )
  }
}

