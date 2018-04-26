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
import { integerWithDelimiter } from 'utils/formatter'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { Translate } from 'react-redux-i18n'
import { SelectField, Slider, TextField, Checkbox } from 'redux-form-material-ui'
import { change, Field, formPropTypes, formValueSelector, reduxForm } from 'redux-form/immutable'
import { DUCK_MAIN_WALLET, getSpendersAllowance } from 'redux/mainWallet/actions'
import { DUCK_SESSION } from 'redux/session/actions'
import { getGasPriceMultiplier } from 'redux/session/selectors'
import { walletDetailSelector, makeGetWalletTokensAndBalanceByAddress } from 'redux/wallet/selectors'
import { DUCK_TOKENS } from 'redux/tokens/actions'
import { getCurrentWallet } from 'redux/wallet/actions'
import inversedTheme from 'styles/themes/inversed'
import styles from '../styles'
import { prefix } from './lang'
import './SendTokensForm.scss'
import validate from './validate'
import WalletAddEditDialog from "../../dialogs/wallet/WalletAddDialog/WalletAddDialog";

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

function mapStateToProps (state, ownProps) {

  const wallet = walletDetailSelector(ownProps.blockchain, ownProps.address)(state)
  const walletInfo = makeGetWalletTokensAndBalanceByAddress(ownProps.blockchain)(state)
  const selector = formValueSelector(FORM_SEND_TOKENS)
  const tokenIdSelect = selector(state, 'symbol')
  const tokenId = walletInfo.tokens.some((token) => token.symbol === tokenIdSelect) ? tokenIdSelect : walletInfo.tokens[0].symbol
  const tokenInfo = walletInfo.tokens.find((token) => token.symbol === tokenId)
  const feeMultiplier = selector(state, 'feeMultiplier')
  const recipient = selector(state, 'recipient')
  const symbol = selector(state, 'symbol')
  const amount = selector(state, 'amount')
  const satPerByte = selector(state, 'satPerByte')
  const token = state.get(DUCK_TOKENS).item(tokenId)
  const isMultiToken = walletInfo.tokens.length > 1

  return {
    wallet,
    tokens: state.get(DUCK_TOKENS),
    allowance: wallet.allowances().item(recipient, tokenId),
    account: state.get(DUCK_SESSION).account,
    amount,
    token,
    tokenInfo,
    isMultiToken,
    walletInfo,
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
    blockchain: PropTypes.string.isRequired,
    address: PropTypes.string.isRequired,
    account: PropTypes.string,
    wallet: PropTypes.object,
    allowance: PropTypes.instanceOf(AllowanceModel),
    recipient: PropTypes.string,
    token: PropTypes.instanceOf(TokenModel),
    tokenInfo: PropTypes.object,
    feeMultiplier: PropTypes.number,
    isMultiTokenWallet: PropTypes.bool,
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
      advancedFee: 0,
      xOfAverageFee: 1
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
    console.log('calculatingFee: ', event, value, this.props.token.symbol())
    var fee = 2
    if (this.props.token.symbol() === 'BTC') {
      fee = await this.calculatingFeeBitcoin(event, value)
      console.log('this.calculatingFeeBitcoin: ', fee, new Date())
    } else if (this.props.token.isERC20()) {
      console.log('this.calculatingFeeBitcoin ERC20 token: ', fee)

      fee = await this.calculatingFeeERC20(event, value)
    }

    console.log('calculatingFee result: ', fee, Number(fee / 100000000).toFixed(8))

    this.setState({
      advancedFee: Number(fee / 100000000).toFixed(8),
      xOfAverageFee: 1
    })
  }

  calculatingFeeSlider = async (event, multiplier) => {
    console.log('calculatingFeeSlider: ', event, multiplier, Number((multiplier * this.props.token.feeRate()).toFixed(1)))
    this.calculatingFee({}, Number((multiplier * this.props.token.feeRate()).toFixed(1)))
  }

  getTransactionFeeDescription = () => {
    if (this.props.token.symbol() === 'BTC') {
      return (<span styleName='description'>
          {`${this.props.token.symbol()}  ${this.state.advancedFee} (≈USD `}
          <TokenValue renderOnlyPrice onlyPriceValue value={new Amount(this.state.advancedFee, this.props.token.symbol())} />
          {`) ${this.state.xOfAverageFee}x `}
          <Translate value={`${prefix}.averageFee`} />
        </span>
      )
    } else if (this.props.token.symbol() === 'ETH') {
      return 'Ethereum transaction fee'
    }

    return null
  }

  renderHead () {
    const { token, isMultiToken, walletInfo, wallet, allowance, tokenInfo } = this.props

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
        { isMultiToken && <div styleName='head-token-choose-form'>
          <MuiThemeProvider theme={inversedTheme}>
            {walletInfo.tokens.length === 0
              ? <Preloader />
              : (
                <Field
                  component={SelectField}
                  name='symbol'
                  fullWidth
                  {...styles}
                >
                  {walletInfo.tokens
                    .map((tokenData) => {
                      const token: TokenModel = this.props.tokens.item(tokenData.symbol)
                      if (token.isLocked()) {
                        return
                      }
                      return (
                        <MenuItem
                          key={token.id()}
                          value={token.id()}
                          primaryText={token.symbol()}
                        />
                      )
                    })}
                </Field>
              )
            }
          </MuiThemeProvider>
        </div> }
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
          <div styleName='value-amount'>
            {tokenInfo.symbol} {integerWithDelimiter(tokenInfo.amount, true, null)}
          </div>
          <div styleName='value'>
            <span styleName='price-value'>
              ≈USD {integerWithDelimiter(tokenInfo.amountPrice.toFixed(2), true, null)}
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
                onChange={this.calculatingFeeSlider}
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
                </span> &nbsp;
                {this.getTransactionFeeDescription()}
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
    // const { visibleBalances } = this.props

    return (<Paper>
        <form onSubmit={this.props.handleSubmit}>
          {this.renderHead()}
          {this.renderBody()}
        </form>
      </Paper>
    )
  }
}

