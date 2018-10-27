/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import Button from 'components/common/ui/Button/Button'
import { TextField } from 'redux-form-material-ui'
import Preloader from 'components/common/Preloader/Preloader'
import TokenValue from 'components/common/TokenValue/TokenValue'
import Amount from '@chronobank/core/models/Amount'
import AssetsCollection from '@chronobank/core/models/assetHolder/AssetsCollection'
import TokenModel from '@chronobank/core/models/tokens/TokenModel'
import { TX_LOCK, TX_UNLOCK } from '@chronobank/core/dao/constants/AssetHolderDAO'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { Translate } from 'react-redux-i18n'
import { Field, formPropTypes, reduxForm } from 'redux-form/immutable'
import { FORM_LABOR_X_CONNECT } from 'components/constants'
import classnames from 'classnames'
import classes from './LaborXConnect.scss'
import validate from './validate'
import { prefix } from './lang'
import LaborXConnectSlider from './LaborXConnectSlider/LaborXConnectSlider'
import { FEE_RATE_MULTIPLIER } from '@chronobank/core/redux/wallets/constants'

const LABOR_X_CONNECT_FIRST = 'laborXConnectFirst'
const LABOR_X_CONNECT_SECOND = 'laborXConnectSecond'

@reduxForm({ form: FORM_LABOR_X_CONNECT, validate })
export default class LaborXConnectForm extends PureComponent {
  static propTypes = {
    feeLoading: PropTypes.bool,
    gasFee: PropTypes.instanceOf(Amount),
    onChangeField: PropTypes.func,
    deposit: PropTypes.instanceOf(Amount),
    balanceEth: PropTypes.instanceOf(Amount),
    token: PropTypes.instanceOf(TokenModel),
    assets: PropTypes.instanceOf(AssetsCollection),
    amount: PropTypes.number,
    ...formPropTypes,
  }

  constructor (props) {
    super(props)
    const step = LABOR_X_CONNECT_FIRST
    this.state = { step }
  }

  handleProceed = (values) => {
    this.props.onSubmit(values.set('action', TX_LOCK).set('token', this.props.token))
  }

  handleUnlock = (values) => {
    this.props.onSubmit(values.set('action', TX_UNLOCK).set('token', this.props.token))
  }

  renderHead () {
    const { step } = this.state
    const title = LABOR_X_CONNECT_FIRST ? 'titleStepOne' : 'titleStepTwov'
    const message = LABOR_X_CONNECT_FIRST ? 'messageStepOne' : 'messageStepTwo'
    return (
      <div styleName='head'>
        <div styleName={classnames('mainTitle', { bordered: step === LABOR_X_CONNECT_FIRST })}>
          <Translate value={`${prefix}.${title}`} />
        </div>
        <div styleName='headContent'>
          <Translate value={`${prefix}.${message}`} />
        </div>
      </div>
    )
  }

  renderBody () {
    const { amount, token, gasFee, feeLoading } = this.props

    if (this.state.step === LABOR_X_CONNECT_SECOND) {
      return null
    }

    return (
      <div>
        <div styleName={classnames('fieldWrapper')}>
          <Field component={LaborXConnectSlider} name='amount' {...FEE_RATE_MULTIPLIER} toFixed={1} />
          <div styleName='amountInFiat'>{token.isFetched() ? <TokenValue renderOnlyPrice value={new Amount(token.addDecimals(amount), token.symbol())} /> : null}</div>
        </div>
        <div styleName='transactionsInfo'>
          <div>
            <b>
              <Translate value={`${prefix}.transactionFee`} />:{' '}
            </b>
            <span styleName='infoText'>
              {feeLoading && <Preloader />}
              {gasFee && <TokenValue value={gasFee} />}
            </span>
          </div>
        </div>
      </div>
    )
  }

  renderFoot () {
    const { balanceEth, handleSubmit, pristine, invalid } = this.props
    const isInvalid = pristine || invalid

    return (
      <div styleName='actions'>
        {balanceEth &&
        balanceEth.gt(0) &&
        this.state.step === LABOR_X_CONNECT_FIRST && (
          <div styleName='action'>
            <Button styleName='actionButton' label={<Translate value={`${prefix}.proceed`} />} onClick={handleSubmit(this.handleProceed)} disabled={isInvalid} />
          </div>
        )}
        {balanceEth &&
        balanceEth.gt(0) &&
        this.state.step === LABOR_X_CONNECT_FIRST && (
          <div styleName='action'>
            <Button styleName='actionButton' label={<Translate value={`${prefix}.unlock`} />} onClick={handleSubmit(this.handleUnlock)} disabled={isInvalid} />
          </div>
        )}
        {this.state.step === LABOR_X_CONNECT_SECOND && (
          <div styleName='action'>
            <Button styleName='actionButton' label={<Translate value={`${prefix}.confirm`} />} onClick={handleSubmit(this.handleProceed)} disabled={isInvalid} />
          </div>
        )}
      </div>
    )
  }

  render () {
    return (
      <div styleName='root'>
        <form onSubmit={this.props.handleSubmit}>
          {this.renderHead()}
          <div styleName='body'>
            {this.renderBody()}
            {this.renderFoot()}
          </div>
        </form>
      </div>
    )
  }
}
