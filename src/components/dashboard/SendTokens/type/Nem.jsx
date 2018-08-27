/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { DUCK_SESSION } from '@chronobank/core/redux/session/constants'
import { walletInfoSelector } from '@chronobank/core/redux/wallet/selectors/selectors'
import { DUCK_TOKENS } from '@chronobank/core/redux/tokens/constants'
import { getMarket } from '@chronobank/core/redux/market/selectors'
import { integerWithDelimiter } from '@chronobank/core/utils/formatter'
import Amount from '@chronobank/core/models/Amount'
import TokenModel from '@chronobank/core/models/tokens/TokenModel'
import WalletModel from '@chronobank/core/models/wallet/WalletModel'
import { estimateNemFee } from '@chronobank/core/redux/nem/thunks'
import Button from 'components/common/ui/Button/Button'
import IPFSImage from 'components/common/IPFSImage/IPFSImage'
import TokenValue from 'components/common/TokenValue/TokenValue'
import {
  ACTION_TRANSFER,
  FORM_SEND_TOKENS,
  MODE_SIMPLE,
} from 'components/constants'

import { TOKEN_ICONS } from 'assets'
import BigNumber from 'bignumber.js'
import { CircularProgress, Paper } from '@material-ui/core'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { Translate } from 'react-redux-i18n'
import { TextField } from 'redux-form-material-ui'
import {
  Field,
  formPropTypes,
  formValueSelector,
  getFormSyncErrors,
  getFormValues,
  reduxForm,
} from 'redux-form/immutable'
import { prefix } from '../lang'

import './form.scss'
import validate from '../validate'

function mapDispatchToProps (dispatch) {
  return {
    estimateFee: async (params, callback) => {
      const fee = await dispatch(estimateNemFee(params, callback))
      return fee
    },
  }
}

function mapStateToProps (state, ownProps) {

  const walletInfo = walletInfoSelector(ownProps.wallet, false, state)
  const { selectedCurrency } = getMarket(state)
  const selector = formValueSelector(FORM_SEND_TOKENS)
  const formValues = getFormValues(FORM_SEND_TOKENS)
  const symbol = selector(state, 'symbol')
  const tokenId = walletInfo.tokens.some((token) => token.symbol === symbol) ? symbol : walletInfo.tokens[0].symbol
  const tokenInfo = walletInfo.tokens.find((token) => token.symbol === tokenId)
  const recipient = selector(state, 'recipient')
  const amount = selector(state, 'amount')
  const mode = selector(state, 'mode')
  const formErrors = getFormSyncErrors(FORM_SEND_TOKENS)(state)
  const token = state.get(DUCK_TOKENS).item(tokenId)

  return {
    selectedCurrency,
    tokens: state.get(DUCK_TOKENS),
    account: state.get(DUCK_SESSION).account,
    amount,
    token,
    tokenInfo,
    walletInfo,
    recipient,
    symbol,
    mode,
    formErrors,
    formValues: (formValues(state) && JSON.stringify(formValues(state).toJSON())) || null,
  }
}

@connect(mapStateToProps, mapDispatchToProps)
@reduxForm({ form: FORM_SEND_TOKENS, validate })
export default class Nem extends PureComponent {
  static propTypes = {
    selectedCurrency: PropTypes.string,
    account: PropTypes.string,
    wallet: PropTypes.instanceOf(WalletModel),
    recipient: PropTypes.string,
    token: PropTypes.instanceOf(TokenModel),
    tokenInfo: PropTypes.shape({
      amount: PropTypes.number,
      amountPrice: PropTypes.number,
      symbol: PropTypes.string,
    }),
    feeMultiplier: PropTypes.number,
    satPerByte: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    transfer: PropTypes.func,
    onTransfer: PropTypes.func,
    onApprove: PropTypes.func,
    ...formPropTypes,
  }

  constructor () {
    super(...arguments)
    this.state = {
      fee: null,
      feeError: false,
    }

    this.timeout = null
  }

  componentWillReceiveProps (newProps) {

    if ((newProps.formValues !== this.props.formValues) &&
      newProps.amount > 0) {
      try {
        const value = new Amount(newProps.token.addDecimals(new BigNumber(newProps.amount)), newProps.symbol)
        this.handleEstimateFee(
          newProps.address,
          newProps.recipient,
          value,
          this.getFormFee(newProps),
          newProps.token.blockchain(),
        )
      } catch (error) {
        // eslint-disable-next-line
        console.error(error)
      }
    }

  }

  componentDidCatch (/*error, info*/) {
    clearTimeout(this.timeout)
  }

  componentWillUnmount () {
    clearTimeout(this.timeout)
  }

  handleTransfer = (values) => {
    this.props.onSubmit(values.set('action', ACTION_TRANSFER), {
      advancedMode: this.state.advancedMode,
      gasLimitEstimated: this.state.gasLimitEstimated,
    })
  }

  handleEstimateFee = (address, recipient, amount, formFee, blockchain) => {
    clearTimeout(this.timeout)
    this.setState({
      feeLoading: true,
    }, () => {
      this.timeout = setTimeout(() => {
        const params = {
          address,
          recipient,
          amount,
          formFee,
          blockchain,
        }
        this.props.estimateFee(params, (error, { fee }) => {
          if (error) {
            this.setState({
              feeError: true,
            })
          } else {
            this.setState({
              fee,
              feeError: false,
              feeLoading: false,
            })
          }
        })
      }, 1000)
    })
  }

  getFormFee = (props = this.props) => {
    return this.props.mode === MODE_SIMPLE ? Number(((props.feeMultiplier) * props.token.feeRate()).toFixed(1)) : props.satPerByte
  }

  getTransactionFeeDescription = () => {

    if (this.props.invalid) {
      return (
        <span styleName='description'>
          <Translate value={`${prefix}.errorFillAllFields`} />
        </span>)
    }
    if (this.state.feeLoading) {
      return <div styleName='fee-loader-container'><CircularProgress size={12} thickness={1.5} /></div>
    }
    if (this.state.feeError) {
      return (
        <span styleName='description'>
          <Translate value={`${prefix}.errorEstimateFee`} />
        </span>)
    }

    if (this.state.fee) {
      return (
        <span styleName='description'>
          {`${this.props.token.symbol()}  ${this.state.fee}`}
          <TokenValue renderOnlyPrice onlyPriceValue value={new Amount(this.state.fee, this.props.token.symbol())} />
        </span>)
    }

    return null
  }

  renderHead () {
    const { token, wallet, tokenInfo } = this.props

    return (
      <div styleName='head'>
        <div styleName='head-token-icon'>
          <IPFSImage
            styleName='icon'
            multihash={token.icon()}
            fallback={TOKEN_ICONS[token.symbol()]}
          />
        </div>

        <div styleName='head-section'>
          <span styleName='head-section-text'>
            <Translate value='wallet.sendTokens' />
          </span>
        </div>

        <div styleName='wallet-name-section'>
          <div styleName='wallet-name-title-section'>
            <span styleName='wallet-name-title'>
              <Translate value='wallet.walletName' />
            </span>
          </div>
          <div styleName='wallet-value'>
            <span styleName='wallet-value'>
              {wallet.address}
            </span>
          </div>
        </div>

        <div styleName='balance'>
          <div styleName='value-amount'>
            {tokenInfo.symbol} {integerWithDelimiter(tokenInfo.amount, true, null)}
          </div>
          <div styleName='value'>
            <span styleName='price-value'>
              ≈{this.props.selectedCurrency} {integerWithDelimiter(tokenInfo.amountPrice.toFixed(2), true, null)}
            </span>
          </div>
        </div>
      </div>
    )
  }

  renderBody () {
    const { invalid, pristine, handleSubmit, wallet } = this.props
    const isTimeLocked = wallet.isTimeLocked

    return (
      <div styleName='form-container'>
        <div>
          <Field
            component={TextField}
            name='recipient'
            label={<Translate value={`${prefix}.recipientAddress`} />}
            fullWidth
          />
          <Field
            name='mode'
            component={(props) => <input type='hidden' {...props} />}
          />
        </div>
        <div styleName='row'>
          <Field
            component={TextField}
            name='amount'
            label={<Translate value={`${prefix}.amount`} />}
            fullWidth
          />
        </div>

        <div styleName='transaction-fee'>
          <span styleName='title'>
            <Translate value={`${prefix}.transactionFee`} />
          </span> &nbsp;
          {this.getTransactionFeeDescription()}
        </div>

        <div styleName='actions-row'>
          <div styleName='send'>
            <Button
              label={<Translate value={`${prefix}.send`} />}
              disabled={pristine || invalid || isTimeLocked}
              onClick={handleSubmit(this.handleTransfer)}
            />
          </div>
        </div>
      </div>
    )
  }

  render () {
    return (
      <Paper>
        <form onSubmit={this.handleFormSubmit}>
          <div styleName='root-container'>
            {this.renderHead()}
            {this.renderBody()}
          </div>
        </form>
      </Paper>
    )
  }
}

