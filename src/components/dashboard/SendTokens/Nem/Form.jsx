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
  FORM_SEND_TOKENS,
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

import '../form.scss'
import validate from '../validate'

const DEBOUNCE_ESTIMATE_FEE_TIMEOUT = 1000

function mapDispatchToProps (dispatch) {
  return {
    estimateFee: (params) => dispatch(estimateNemFee(params)),
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

  componentDidUpdate (prevProps) {
    if (this.props.amount > 0 && prevProps.formValues !== prevProps.formValues) {
      try {
        const value = new Amount(this.props.token.addDecimals(new BigNumber(this.props.amount)), this.props.symbol)
        this.handleEstimateFee(
          this.props.wallet.address,
          this.props.recipient,
          value,
          this.props.token,
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
    this.props.onSubmit(values)
  }

  handleEstimateFee = (address, recipient, amount, token) => {
    clearTimeout(this.timeout)
    this.setState({
      feeLoading: true,
    }, () => {
      this.timeout = setTimeout(async () => {
        try {
          const params = {
            from: address,
            to: recipient,
            amount,
            token,
          }
          const fee = await this.props.estimateFee(params)

          this.setState({
            fee,
            feeError: false,
            feeLoading: false,
          })
        } catch (error) {
          this.setState({
            feeError: true,
            feeLoading: false,
          })
        }
      }, DEBOUNCE_ESTIMATE_FEE_TIMEOUT)
    })
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
          {`${this.props.token.symbol()}  ${this.state.fee} (≈${this.props.selectedCurrency} `}
          <TokenValue renderOnlyPrice onlyPriceValue value={new Amount(this.state.fee, this.props.token.symbol())} />{')'}
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
    const { invalid, pristine, handleSubmit } = this.props

    return (
      <div styleName='form-container'>
        <div>
          <Field
            component={TextField}
            name='recipient'
            label={<Translate value={`${prefix}.recipientAddress`} />}
            fullWidth
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
              disabled={pristine || invalid}
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
