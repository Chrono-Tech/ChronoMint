/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import TokenValue from 'components/common/TokenValue/TokenValue'
import web3Converter from '@chronobank/core/utils/Web3Converter'
import Amount from '@chronobank/core/models/Amount'
import * as validators from '@chronobank/core/models/validator'
import { CircularProgress } from '@material-ui/core'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { Translate } from 'react-redux-i18n'
import { TextField } from 'redux-form-material-ui'
import Slider from 'components/common/Slider'
import { change, Field } from 'redux-form/immutable'
import { FEE_RATE_MULTIPLIER } from '@chronobank/core/redux/wallets/constants'
import { FORM_SEND_TOKENS, MODE_ADVANCED, MODE_SIMPLE } from 'components/constants'
import { prefix } from '../lang'
import '../form.scss'

const DEBOUNCE_ESTIMATE_FEE_TIMEOUT = 1000

export default class abstractEstimateFee extends PureComponent {

  static propTypes = {
    gasLimit: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    gweiPerGas: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    mode: PropTypes.oneOf([MODE_ADVANCED, MODE_SIMPLE]),
    estimateGas: PropTypes.func,
    gasPriceMultiplier: PropTypes.number,
    formName: PropTypes.string,
  }

  static defaultProps = {
    mode: MODE_SIMPLE,
    gasPriceMultiplier: 1,
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
    const { formName } = this.props

    if (this.props.mode === MODE_SIMPLE && this.props.feeMultiplier !== prevProps.feeMultiplier) {
      prevProps.dispatch(change(formName, 'gweiPerGas', this.getFormFee(this.props)))
    }
    if (this.props.gasPriceMultiplier !== prevProps.gasPriceMultiplier) {
      prevProps.dispatch(change(formName, 'feeMultiplier', this.props.gasPriceMultiplier))
    }
    if (!prevProps.gasLimit && prevState.gasLimit && prevProps.gasLimit !== prevState.gasLimit) {
      prevProps.dispatch(change(formName, 'gasLimit', prevState.gasLimit))
    }
  }

  componentDidCatch (/*error, info*/) {
    clearTimeout(this.timeout)
  }

  componentWillUnmount () {
    clearTimeout(this.timeout)
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
            gasFee: new Amount(web3Converter.toWei(props.gweiPerGas || 0, 'gwei') * customGasLimit, this.props.symbol),
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
              gasFeeLoading: false,
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
          <span>{`${this.props.symbol} ${web3Converter.fromWei(this.state.gasFee, 'wei').toString()} (≈${this.props.selectedCurrency} `}
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

  simpleFeeContainer = () => {
    return (
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
  }

  advancedFeeContainer = () => {
    return (
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
  }

  render () {
    return null
  }
}

