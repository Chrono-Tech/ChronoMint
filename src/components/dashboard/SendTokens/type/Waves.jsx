/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import Button from 'components/common/ui/Button/Button'
import IPFSImage from 'components/common/IPFSImage/IPFSImage'
import { ETH } from '@chronobank/core/dao/constants'
import { TOKEN_ICONS } from 'assets'
import Preloader from 'components/common/Preloader/Preloader'
import TokenValue from 'components/common/TokenValue/TokenValue'
import { TX_TRANSFER } from '@chronobank/core/dao/constants/ERC20DAO'
import web3Converter from '@chronobank/core/utils/Web3Converter'
import Amount from '@chronobank/core/models/Amount'
import Immutable from 'immutable'
import * as validators from '@chronobank/core/models/validator'
import { CircularProgress, MenuItem, MuiThemeProvider, Paper } from '@material-ui/core'
import TokenModel from '@chronobank/core/models/tokens/TokenModel'
import PropTypes from 'prop-types'
import WalletModel from '@chronobank/core/models/wallet/WalletModel'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { Translate } from 'react-redux-i18n'
import { TextField } from 'redux-form-material-ui'
import Select from 'redux-form-material-ui/es/Select'
import Slider from 'components/common/Slider'
import { change, Field, formPropTypes, formValueSelector, getFormSyncErrors, getFormValues, reduxForm } from 'redux-form/immutable'
import { getSpendersAllowance } from '@chronobank/core/redux/mainWallet/actions'
import { FEE_RATE_MULTIPLIER } from '@chronobank/core/redux/mainWallet/constants'
import { DUCK_SESSION } from '@chronobank/core/redux/session/constants'
import { walletInfoSelector } from '@chronobank/core/redux/wallet/selectors/selectors'
import { DUCK_TOKENS } from '@chronobank/core/redux/tokens/constants'
import inversedTheme from 'styles/themes/inversed'
import { getMarket } from '@chronobank/core/redux/market/selectors'
import { MultisigEthWalletModel } from '@chronobank/core/models'
import { integerWithDelimiter } from '@chronobank/core/utils/formatter'
import { ACTION_APPROVE, ACTION_TRANSFER, FORM_SEND_TOKENS, MODE_ADVANCED, MODE_SIMPLE } from 'components/constants'
import { prefix } from '../lang'
import './form.scss'
import validate from '../validate'

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
  const isMultiToken = walletInfo.tokens.length > 1

  return {
    selectedCurrency,
    tokens: state.get(DUCK_TOKENS),
    account: state.get(DUCK_SESSION).account,
    amount,
    token,
    tokenInfo,
    isMultiToken,
    walletInfo,
    recipient,
    symbol,
    mode,
    formErrors,
    formValues: (formValues(state) && JSON.stringify(formValues(state).toJSON())) || null,
  }
}

@connect(mapStateToProps)
@reduxForm({ form: FORM_SEND_TOKENS, validate })
export default class Ethereum extends PureComponent {
  static propTypes = {
    selectedCurrency: PropTypes.string,
    account: PropTypes.string,
    wallet: PropTypes.oneOfType([PropTypes.instanceOf(WalletModel), PropTypes.instanceOf(MultisigEthWalletModel)]),
    recipient: PropTypes.string,
    token: PropTypes.instanceOf(TokenModel),
    tokenInfo: PropTypes.shape({
      amount: PropTypes.number,
      amountPrice: PropTypes.number,
      symbol: PropTypes.string,
    }),
    feeMultiplier: PropTypes.number,
    gasLimit: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    gweiPerGas: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    isMultiTokenWallet: PropTypes.bool,
    transfer: PropTypes.func,
    estimateGas: PropTypes.func,
    onTransfer: PropTypes.func,
    onApprove: PropTypes.func,
    gasPriceMultiplier: PropTypes.number,
    ...formPropTypes,
  }

  constructor () {
    super(...arguments)
    this.state = {
      fee: new Amount(10000, 'WAVES'),
    }

    this.timeout = null
  }

  componentDidCatch (/*error, info*/) {
    clearTimeout(this.timeout)
  }

  componentWillUnmount () {
    clearTimeout(this.timeout)
  }

  handleTransfer = (values) => {
    this.props.onSubmit(values.set('action', ACTION_TRANSFER))
  }

  getTransactionFeeDescription = () => {

    if (this.props.invalid) {
      return (
        <span styleName='description'>
          <Translate value={`${prefix}.errorFillAllFields`} />
        </span>)
    }

    return (
      <span styleName='description'>
        {this.state.fee && (
          <span>{`WAVES ${this.state.fee.toString()} (≈${this.props.selectedCurrency} `}
            <TokenValue renderOnlyPrice onlyPriceValue value={this.state.fee} />{')'}
          </span>
        )}
      </span>)
  }

  renderHead () {
    const { token, isMultiToken, walletInfo, wallet, tokenInfo } = this.props

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
        {isMultiToken && (
          <div styleName='head-token-choose-form'>
            <MuiThemeProvider theme={inversedTheme}>
              {walletInfo.tokens.length === 0
                ? <Preloader />
                : (
                  <Field
                    component={Select}
                    name='symbol'
                    styleName='symbolSelector'
                    menu-symbol='symbolSelectorMenu'
                    floatingLabelStyle={{ color: 'white' }}
                  >
                    {walletInfo.tokens
                      .map((tokenData) => {
                        const token: TokenModel = this.props.tokens.item(tokenData.symbol)
                        if (token.isLocked()) {
                          return null
                        }
                        return (<MenuItem  key={token.id()} value={token.id()}>{token.symbol()}</MenuItem>)
                      })}
                  </Field>
                )
              }
            </MuiThemeProvider>
          </div>
        )}
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
              disabled={pristine || invalid }
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

