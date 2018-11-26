/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import BigNumber from 'bignumber.js'
import TokenValue from 'components/common/TokenValue/TokenValue'
import Amount from '@chronobank/core/models/Amount'
import AssetsCollection from '@chronobank/core/models/assetHolder/AssetsCollection'
import TokenModel from '@chronobank/core/models/tokens/TokenModel'
import { TextField } from 'redux-form-material-ui'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { Translate } from 'react-redux-i18n'
import { Field, formPropTypes, reduxForm } from 'redux-form/immutable'
import { FORM_LABOR_X_CONNECT } from 'components/constants'
import classnames from 'classnames'
import { TIME } from '@chronobank/core/dao/constants'
import { CHRONOBANK_NODE_FEE_COEFFICIENT } from '@chronobank/core/redux/laborHour/constants'
import Button from 'components/common/ui/Button/Button'
import { TX_LOCK } from '@chronobank/core/dao/constants/AssetHolderDAO'
import validate from './validate'
import { prefix } from './lang'
import LaborXConnectSlider from './LaborXConnectSlider/LaborXConnectSlider'
import './LaborXConnect.scss'
import Preloader from '../../common/Preloader/Preloader'
import TokenValueSimple from '../../common/TokenValueSimple/TokenValueSimple'
import GasSlider from '../../common/GasSlider/GasSlider'
import { nodes } from './constants'
import { FEE_RATE_MULTIPLIER } from '@chronobank/core/redux/wallets/constants'

const LABOR_X_CONNECT_FIRST = 'laborXConnectFirst'
const LABOR_X_CONNECT_SECOND = 'laborXConnectSecond'

@reduxForm({ form: FORM_LABOR_X_CONNECT, validate })
export default class LaborXConnectForm extends PureComponent {
  static propTypes = {
    feeMultiplier: PropTypes.number,
    feeLoading: PropTypes.bool,
    gasFee: PropTypes.instanceOf(Amount),
    onChangeField: PropTypes.func,
    deposit: PropTypes.instanceOf(Amount),
    balanceEth: PropTypes.instanceOf(Amount),
    token: PropTypes.instanceOf(TokenModel),
    assets: PropTypes.instanceOf(AssetsCollection),
    amount: PropTypes.number,
    onEstimateFee: PropTypes.func,
    miningParams: PropTypes.shape({
      minDepositLimit: PropTypes.string,
      rewardsCoefficient: PropTypes.string,
      isCustomNode: PropTypes.bool,
    }),
    timeTokenLX: PropTypes.instanceOf(TokenModel),
    ...formPropTypes,
  }

  constructor (props) {
    super(props)
    this.state = { step: LABOR_X_CONNECT_FIRST }
  }

  componentWillReceiveProps (newProps) {
    const isAmountChanged = newProps.amount !== this.props.amount
    const isMultiplierChanged = newProps.feeMultiplier !== this.props.feeMultiplier
    if (newProps.amount > 0 && (isAmountChanged || isMultiplierChanged)) {
      newProps.onEstimateFee(TX_LOCK, newProps.amount, newProps.token, newProps.feeMultiplier)
    }
    return null
  }

  handleProceed = (values) => {
    this.props.onSubmit(
      values.set('action', TX_LOCK).set('token', this.props.token),
    )
  }

  handleProceedCustomNode = (values) => {
    this.props.onSubmit(
      values
        .set('action', TX_LOCK)
        .set('token', this.props.token)
        .set('isCustomNode', true),
    )
  }

  handleSetNextStep = () => {
    this.setState({ step: LABOR_X_CONNECT_SECOND })
  }

  renderHead () {
    const { step } = this.state
    const title =
      step === LABOR_X_CONNECT_FIRST ? 'titleStepOne' : 'titleStepTwo'
    const message = 'messageStepOne'
    return (
      <div styleName='head'>
        <div
          styleName={classnames('mainTitle', {
            bordered: step === LABOR_X_CONNECT_FIRST,
          })}
        >
          <Translate value={`${prefix}.connectForm.${title}`} />
        </div>
        {step === LABOR_X_CONNECT_FIRST && (
          <div styleName='headContent'>
            <Translate value={`${prefix}.connectForm.${message}`} />
          </div>
        )}
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
              <TokenValueSimple value={button.subTitle.amount} />
            </div>
          ) : null}
        </button>
      </div>
    )
  }

  renderFirstStep () {
    const { deposit, token, handleSubmit, miningParams, amount } = this.props

    const { rewardsCoefficient, minDepositLimit } = miningParams
    const amountBN = new BigNumber(amount)
    const buttons = {
      buttonLeft: {
        onClick: handleSubmit(this.handleProceed),
        topValue: new Amount(
          amountBN.mul(rewardsCoefficient).mul(CHRONOBANK_NODE_FEE_COEFFICIENT),
          'LHT',
        ), // 10% chronobank fee
        button: {
          styleName: 'blue',
          title: `${prefix}.connectForm.useOurNode`,
        },
      },
      buttonRight: {
        onClick: this.handleSetNextStep,
        topValue: new Amount(amountBN.mul(rewardsCoefficient), 'LHT'),
        button: {
          styleName: 'red',
          title: `${prefix}.connectForm.useCustomNode`,
          subTitle: {
            value: `${prefix}.connectForm.minDeposit`,
            amount: new Amount(minDepositLimit, TIME),
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
        <div styleName='gasSliderWrapper'>
          <Field
            gasFee={this.props.gasFee}
            component={GasSlider}
            name='feeMultiplier'
            {...FEE_RATE_MULTIPLIER}
          />
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
    return (
      <div>
        <div styleName='miningSteps'>
          <div styleName='item'>
            <div styleName='itemIcon'>1</div>
            <div styleName='itemTitle'>
              <Translate value={`${prefix}.connectForm.downloadCustomNode`} />
            </div>
            <div styleName='itemText'>
              <Translate value={`${prefix}.connectForm.parityTitle`} />
              {nodes.map((button) => {
                return (
                  <div key={button.title}>
                    <a href={button.link}>
                      <Translate value={`${prefix}.nodes.${button.title}`} />
                    </a>
                  </div>
                )
              })}

            </div>
          </div>
          <div styleName='item'>
            <div styleName='itemIcon'>2</div>
            <div styleName='itemTitle'>
              <Translate value={`${prefix}.connectForm.enterDelegateAddress`} />
            </div>
            <div styleName='itemText'>
              <Translate value={`${prefix}.connectForm.delegateAddressTitle`} />
              <Field
                component={TextField}
                name='delegateAddress'
                type='text'
                label={<Translate value={`${prefix}.settingsForm.enterDelegateAddress`} />}
                fullWidth
              />
            </div>
          </div>
          <div styleName='item'>
            <div styleName='itemIcon'>3</div>
            <div styleName='itemTitle'>
              <Translate value={`${prefix}.connectForm.startMining`} />
            </div>
            <div styleName='itemText'>
              <Translate value={`${prefix}.connectForm.startMiningTitle`} />
            </div>
          </div>
        </div>
        <div styleName='buttonWrapper'>
          <Button onClick={this.props.handleSubmit(this.handleProceedCustomNode)}>
            <Translate value={`${prefix}.settingsForm.done`} />
          </Button>
        </div>
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
