/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import Button from 'components/common/ui/Button/Button'
import IPFSImage from 'components/common/IPFSImage/IPFSImage'
import { TOKEN_ICONS } from 'assets'
import Preloader from 'components/common/Preloader/Preloader'
import { MenuItem, MuiThemeProvider, Paper } from '@material-ui/core'
import TokenModel from '@chronobank/core/models/tokens/TokenModel'
import PropTypes from 'prop-types'
import WalletModel from '@chronobank/core/models/wallet/WalletModel'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { Translate } from 'react-redux-i18n'
import { TextField } from 'redux-form-material-ui'
import Select from 'redux-form-material-ui/es/Select'
import {
  Field,
  formPropTypes,
  formValueSelector,
  getFormSyncErrors,
  getFormValues,
  reduxForm,
} from 'redux-form/immutable'
import inversedTheme from 'styles/themes/inversed'
import { EOS } from '@chronobank/core/redux/eos/constants'
import { MultisigEthWalletModel } from '@chronobank/core/models'
import { integerWithDelimiter } from '@chronobank/core/utils/formatter'
import { getEOSWalletsTokens } from '@chronobank/core/redux/eos/selectors'
import {
  ACTION_TRANSFER,
  FORM_SEND_TOKENS,
} from 'components/constants'
import { selectMarketPrices, selectCurrentCurrency } from '@chronobank/market/redux/selectors'
import { prefix } from '../lang'
import '../form.scss'
import validate from './validate'

function mapStateToProps (state, ownProps) {

  // @todo Research about curl braces
  const { selectedCurrency } = selectCurrentCurrency(state)
  const selector = formValueSelector(FORM_SEND_TOKENS)
  const formValues = getFormValues(FORM_SEND_TOKENS)
  const symbol = selector(state, 'symbol')
  const feeMultiplier = selector(state, 'feeMultiplier')
  const recipient = selector(state, 'recipient')
  const amount = selector(state, 'amount')
  const gweiPerGas = selector(state, 'gweiPerGas')
  const gasLimit = selector(state, 'gasLimit')
  const formErrors = getFormSyncErrors(FORM_SEND_TOKENS)(state)
  const walletsTokens = getEOSWalletsTokens(ownProps.wallet.id)(state)
  const initialValues = {
    symbol: symbol || EOS,
  }
  const prices = selectMarketPrices(state)

  return {
    selectedCurrency,
    amount,
    recipient,
    symbol,
    formErrors,
    formValues: (formValues(state) && JSON.stringify(formValues(state).toJSON())) || null,
    feeMultiplier,
    gasLimit,
    gweiPerGas,
    walletsTokens,
    initialValues,
    prices,
  }
}

@connect(mapStateToProps)
@reduxForm({ form: FORM_SEND_TOKENS, validate })
export default class Eos extends PureComponent {

  static propTypes = {
    walletsTokens: PropTypes.arrayOf(PropTypes.string),
    selectedCurrency: PropTypes.string,
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

  handleTransfer = (values) => {
    this.props.onSubmit(values.set('action', ACTION_TRANSFER))
  }

  renderHead () {
    const { wallet, symbol, walletsTokens, prices, selectedCurrency } = this.props
    const tokenPrice = prices[symbol] && prices[symbol][selectedCurrency] || 0

    return (
      <div styleName='head'>
        <div styleName='head-token-icon'>
          <IPFSImage
            styleName='icon'
            fallback={TOKEN_ICONS[symbol]}
          />
        </div>

        <div styleName='head-section'>
          <span styleName='head-section-text'>
            <Translate value='wallet.sendTokens' />
          </span>
        </div>
        <div styleName='head-token-choose-form'>
          <MuiThemeProvider theme={inversedTheme}>
            {walletsTokens.length === 0
              ? <Preloader />
              : (
                <Field
                  component={Select}
                  name='symbol'
                  styleName='symbolSelector'
                  menu-symbol='symbolSelectorMenu'
                >
                  {walletsTokens
                    .map((symbol) => {
                      return (<MenuItem key={symbol} value={symbol}>{symbol}</MenuItem>)
                    })}
                </Field>
              )
            }
          </MuiThemeProvider>
        </div>
        <div styleName='wallet-name-section'>
          <div styleName='wallet-name-title-section'>
            <span styleName='wallet-name-title'>
              <Translate value={`${prefix}.accountName`} />
            </span>
          </div>
          <div styleName='wallet-value'>
            <span styleName='wallet-value'>
              {wallet.address}
            </span>
          </div>
        </div>

        <div styleName='balance'>
          {symbol && (
            <div styleName='value-amount'>
              {symbol} {integerWithDelimiter(wallet.balances[symbol], true, null)}
            </div>
          )}
          <div styleName='value'>
            <span styleName='price-value'>
              ≈{this.props.selectedCurrency} {integerWithDelimiter(tokenPrice.toFixed(2), true, null)}
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
            label={<Translate value={`${prefix}.recipientAccount`} />}
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
        <div styleName='row'>
          <Field
            component={TextField}
            name='memo'
            label={<Translate value={`${prefix}.memo`} />}
            fullWidth
          />
        </div>
        <div styleName='eos-actions-row'>
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
