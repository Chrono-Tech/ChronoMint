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
import { Map } from 'immutable'
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
import { getGasPriceMultiplier } from '@chronobank/core/redux/session/selectors'
import { walletInfoSelector } from '@chronobank/core/redux/wallet/selectors/selectors'
import { estimateGasTransfer } from '@chronobank/core/redux/tokens/thunks'
import { DUCK_TOKENS } from '@chronobank/core/redux/tokens/constants'
import inversedTheme from 'styles/themes/inversed'
import { getMarket } from '@chronobank/core/redux/market/selectors'
import { MultisigEthWalletModel } from '@chronobank/core/models'
import { integerWithDelimiter } from '@chronobank/core/utils/formatter'
import { ACTION_APPROVE, ACTION_TRANSFER, FORM_SEND_TOKENS, MODE_ADVANCED, MODE_SIMPLE } from 'components/constants'
import { prefix } from '../lang'
import '../form.scss'
import validate from '../validate'

const DEBOUNCE_ESTIMATE_FEE_TIMEOUT = 1000

function mapDispatchToProps (dispatch) {
  return {
    estimateGas: (tokenId, params, gasPriceMultiplier, address) => dispatch(estimateGasTransfer(tokenId, params, gasPriceMultiplier, address)),
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
  const feeMultiplier = selector(state, 'feeMultiplier')
  const recipient = selector(state, 'recipient')
  const amount = selector(state, 'amount')
  const gweiPerGas = selector(state, 'gweiPerGas')
  const gasLimit = selector(state, 'gasLimit')
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
    feeMultiplier,
    gasLimit,
    gweiPerGas,
    gasPriceMultiplier: getGasPriceMultiplier(token.blockchain())(state),
  }
}

@connect(mapStateToProps, mapDispatchToProps)
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
      gasFee: null,
      gasPrice: null,
      gasLimit: null,
      gasLimitEstimated: null,
      gasFeeError: false,
      gasFeeLoading: false,
    }

    this.timeout = null
  }

  componentDidUpdate (prevProps, prevState) {

    if (this.props.amount > 0 && (this.props.formValues !== prevProps.formValues)) {
      try {
        const { token, recipient, amount, feeMultiplier, wallet } = this.props
        const value = new Amount(token.addDecimals(amount), this.props.symbol)

        this.handleEstimateGas(token.symbol(), [recipient, value, TX_TRANSFER], feeMultiplier, wallet.address)
      } catch (error) {
        // eslint-disable-next-line
        console.error(error)
      }
    }

    if ((this.props.token.address() !== prevProps.token.address() || this.props.recipient !== prevProps.recipient) && this.props.token.isERC20()) {
      this.props.dispatch(getSpendersAllowance(this.props.token.id(), this.props.recipient))
    }

    if (this.props.mode === MODE_SIMPLE && this.props.feeMultiplier !== prevProps.feeMultiplier) {
      prevProps.dispatch(change(FORM_SEND_TOKENS, 'gweiPerGas', this.getFormFee(this.props)))
    }
    if (this.props.gasPriceMultiplier !== prevProps.gasPriceMultiplier) {
      prevProps.dispatch(change(FORM_SEND_TOKENS, 'feeMultiplier', this.props.gasPriceMultiplier))
    }
    if (!prevProps.gasLimit && prevState.gasLimit && prevProps.gasLimit !== prevState.gasLimit) {
      prevProps.dispatch(change(FORM_SEND_TOKENS, 'gasLimit', prevState.gasLimit))
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

  handleApprove = (values) => {
    this.props.onSubmit(values.set('action', ACTION_APPROVE))
  }

  handleRevoke = () => {
    this.props.onSubmit(new Map({
      action: ACTION_APPROVE,
      symbol: this.props.token.symbol(),
      amount: 0,
      recipient: this.props.recipient,
    }))
  }

  handleChangeFeeSlider = async (event, multiplier) => {
    this.calculatingFee({}, Number((multiplier * this.props.token.feeRate()).toFixed(1)))
  }

  handleChangeMode = () => {
    this.props.dispatch(change(FORM_SEND_TOKENS, 'mode', this.props.mode === MODE_SIMPLE ? MODE_ADVANCED : MODE_SIMPLE))
  }

  handleEstimateGas = (tokenId, params, feeMultiplier, address) => {
    clearTimeout(this.timeout)
    const { gasLimit, gweiPerGas } = this.props
    if (this.props.mode === MODE_ADVANCED && (gasLimit || this.state.gasLimitEstimated) && gweiPerGas) {

      this.setState((state, props) => {
        if (!validators.positiveNumber(props.gweiPerGas)) {
          const customGasLimit = props.gasLimit || this.state.gasLimitEstimated
          return {
            gasFee: new Amount(web3Converter.toWei(props.gweiPerGas || 0, 'gwei') * customGasLimit, ETH),
            gasPrice: web3Converter.toWei(props.gweiPerGas || 0, 'gwei'),
            gasFeeError: false,
            gasFeeLoading: false,
          }
        }
      })

    } else {
      this.setState({
        gasFeeLoading: true,
      }, () => {
        this.timeout = setTimeout(async () => {
          try {
            const { gasLimit, gasFee, gasPrice } = await this.props.estimateGas(tokenId, params, feeMultiplier, address)
            this.setState(() => {
              return {
                gasFee,
                gasPrice,
                gasLimitEstimated: gasLimit,
                gasFeeError: false,
                gasFeeLoading: false,
              }
            })
          } catch (error) {
            this.setState({
              gasFeeError: true,
            })
          }
        }, DEBOUNCE_ESTIMATE_FEE_TIMEOUT)
      })
    }
  }

  getFormFee = (props = this.props) => {
    return this.props.mode === MODE_SIMPLE ? Number(((props.feeMultiplier) * props.token.feeRate()).toFixed(1)) : props.gweiPerGas
  }

  getTransactionFeeDescription = () => {

    if (this.props.invalid) {
      return (
        <span styleName='description'>
          <Translate value={`${prefix}.errorFillAllFields`} />
        </span>)
    }
    if (this.state.gasFeeLoading) {
      return <div styleName='fee-loader-container'><CircularProgress size={12} thickness={1.5} /></div>
    }
    if (this.state.gasFeeError) {
      return (
        <span styleName='description'>
          <Translate value={`${prefix}.errorEstimateFee`} />
        </span>)
    }

    return (
      <span styleName='description'>
        {this.state.gasFee && (
          <span>{`ETH ${web3Converter.fromWei(this.state.gasFee, 'wei').toString()} (≈${this.props.selectedCurrency} `}
            <TokenValue renderOnlyPrice onlyPriceValue value={this.state.gasFee} />{')'}
          </span>
        )}
        {this.props.mode === MODE_SIMPLE && this.state.gasPrice && (
          <span styleName='gwei-multiplier'>
            <Translate value={`${prefix}.averageFee`} multiplier={this.props.feeMultiplier} />
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
    const { invalid, mode, pristine, token, handleSubmit, feeMultiplier, wallet } = this.props
    const isTimeLocked = wallet.isTimeLocked

    const simpleContainer = () => (
      <div styleName='row'>
        <div styleName='feeRate'>
          <div styleName='tagsWrap'>
            <div><Translate value={`${prefix}.slowTransaction`} /></div>
            <div><Translate value={`${prefix}.fast`} /></div>
          </div>

          <Field
            component={Slider}
            name='feeMultiplier'
            {...FEE_RATE_MULTIPLIER}
            toFixed={1}
          />
        </div>
      </div>
    )

    const advancedContainer = () => (
      <div styleName='advanced-mode-container'>
        <div styleName='field'>
          <Field
            component={TextField}
            name='gweiPerGas'
            label={<Translate value='wallet.gweiPerGas' />}
            fullWidth
          />
        </div>
        <div styleName='field'>
          <Field
            component={TextField}
            name='gasLimit'
            label={<Translate value='wallet.gasLimit' />}
            fullWidth
          />
        </div>
        {
          this.state.gasLimitEstimated && !this.props.gasLimit && (
            <div styleName='gas-limit-based-container'>
              <span styleName='gas-limit-based'>
                <Translate value={`${prefix}.basedOnLimit`} limit={this.state.gasLimitEstimated} />
                <span
                  styleName='based-limit-value'
                  onClick={() => this.props.dispatch(change(FORM_SEND_TOKENS, 'gasLimit', this.state.gasLimitEstimated))}
                >
                  {this.state.gasLimitEstimated}
                </span>
              </span>
            </div>
          )
        }
      </div>
    )

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
        { mode === MODE_SIMPLE && feeMultiplier && token.feeRate() && simpleContainer() }
        { mode === MODE_ADVANCED && advancedContainer() }

        <div styleName='transaction-fee'>
          <span styleName='title'>
            <Translate value={`${prefix}.transactionFee`} />
          </span> &nbsp;
          {this.getTransactionFeeDescription()}
        </div>

        <div styleName='actions-row'>
          <div styleName='advanced-simple'>
            <div onClick={this.handleChangeMode}>
              <span styleName='advanced-text'>
                <Translate value={mode === MODE_SIMPLE ? 'wallet.modeAdvanced' : 'wallet.modeSimple'} />
              </span>
            </div>
          </div>
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

