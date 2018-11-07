/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import BigNumber from 'bignumber.js'
import TokenValue from 'components/common/TokenValue/TokenValue'
import Amount from '@chronobank/core/models/Amount'
import AssetsCollection from '@chronobank/core/models/assetHolder/AssetsCollection'
import TokenModel from '@chronobank/core/models/tokens/TokenModel'
import {
  TX_LOCK,
  TX_UNLOCK,
} from '@chronobank/core/dao/constants/AssetHolderDAO'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { Translate } from 'react-redux-i18n'
import { Field, formPropTypes, reduxForm } from 'redux-form/immutable'
import { FORM_LABOR_X_CONNECT } from 'components/constants'
import classnames from 'classnames'
import validate from './validate'
import { prefix } from './lang'
import LaborXConnectSlider from './LaborXConnectSlider/LaborXConnectSlider'
import './LaborXConnect.scss'
import Preloader from '../../common/Preloader/Preloader'

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
    this.setState({ step: LABOR_X_CONNECT_SECOND })
    this.props.onSubmit(
      values.set('action', TX_LOCK).set('token', this.props.token)
    )
  }

  handleUnlock = (values) => {
    this.props.onSubmit(
      values.set('action', TX_UNLOCK).set('token', this.props.token)
    )
  }

  renderHead () {
    const { step } = this.state
    const title =
      step === LABOR_X_CONNECT_FIRST ? 'titleStepOne' : 'titleStepTwo'
    const message =
      step === LABOR_X_CONNECT_FIRST ? 'messageStepOne' : 'messageStepTwo'
    return (
      <div styleName='head'>
        <div
          styleName={classnames('mainTitle', {
            bordered: step === LABOR_X_CONNECT_FIRST,
          })}
        >
          <Translate value={`${prefix}.connectForm.${title}`} />
        </div>
        <div styleName='headContent'>
          <Translate value={`${prefix}.connectForm.${message}`} />
        </div>
      </div>
    )
  }

  renderButton ([id, { onClick, topValue, button }]) {
    return (
      <div key={id} styleName='button'>
        <div styleName='buttonInfo'>
          <div>
            <Translate value={`${prefix}.connectForm.rewardPerBlock`} />
          </div>
          <div>
            <TokenValue value={topValue} />
          </div>
        </div>
        <button
          onClick={onClick}
          styleName={classnames('buttonInfoButton', button.styleName)}
        >
          <div styleName='title'>
            <Translate value={button.title} />
          </div>
          {button.subTitle ? (
            <div styleName='subTitle'>
              <Translate {...button.subTitle} />
            </div>
          ) : null}
        </button>
      </div>
    )
  }

  renderFirstStep () {
    const { deposit, token, handleSubmit } = this.props
    const buttons = {
      buttonLeft: {
        onClick: handleSubmit(this.handleProceed),
        topValue: new Amount(2 * Math.pow(10, 18), 'LHT'),
        button: {
          styleName: 'blue',
          title: `${prefix}.connectForm.useOurNode`,
        },
      },
      buttonRight: {
        onClick: handleSubmit(this.handleProceed),
        topValue: new Amount(3 * Math.pow(10, 18), 'LHT'),
        button: {
          styleName: 'red',
          title: `${prefix}.connectForm.useCustomNode`,
          subTitle: {
            value: `${prefix}.connectForm.minDeposit`,
            amount: '10 TIME',
          },
        },
      },
    }

    return (
      <div>
        <div styleName={classnames('fieldWrapper')}>
          {deposit.gt(0) && token.decimals() > 0 ? (
            <Field
              component={LaborXConnectSlider}
              name='amount'
              toFixed={1}
              min={0}
              step={token.addDecimals(new BigNumber(1)).toNumber()}
              max={deposit.toNumber()}
              token={token}
            />
          ) : (
            <Preloader />
          )}
        </div>
        <div styleName='actions'>
          {Object.entries(buttons).map((entry) => {
            return this.renderButton(entry)
          })}
        </div>
      </div>
    )
  }

  renderSecondStep () {
    const buttons = [
      {
        title: 'winNode',
        onClick: () => {},
      },
      {
        title: 'macNode',
        onClick: () => {},
      },
      {
        title: 'linuxNode',
        onClick: () => {},
      },
    ]
    return (
      <div styleName='downloadButtons'>
        {buttons.map((button) => {
          return (
            <button key={button.title}>
              <Translate value={`${prefix}.nodes.${button.title}`} />
            </button>
          )
        })}
      </div>
    )
  }

  render () {
    return (
      <div styleName='root'>
        <form name={FORM_LABOR_X_CONNECT} onSubmit={this.props.handleSubmit}>
          {this.renderHead()}
          <div styleName='body'>
            {this.state.step === LABOR_X_CONNECT_FIRST
              ? this.renderFirstStep()
              : this.renderSecondStep()}
          </div>
        </form>
      </div>
    )
  }
}
