/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import BigNumber from 'bignumber.js'
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

  static defaultProps = {
    initialValues: {
      amount: 0,
    },
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
    const title = step === LABOR_X_CONNECT_FIRST ? 'titleStepOne' : 'titleStepTwo'
    const message = step === LABOR_X_CONNECT_FIRST ? 'messageStepOne' : 'messageStepTwo'
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

  renderButton ([id, { onClick, topValue, bottom }]) {
    return (
      <div key={id} styleName='button'>
        <div styleName='buttonInfo'>
          <div>Reward per block</div>
          <div><TokenValue value={topValue} /></div>
        </div>
        <button onClick={onClick} styleName={classnames('buttonInfoBottom', bottom.styleName)}>
          <div styleName='title'>{bottom.title}</div>
          <div styleName='subTitle'>{bottom.subTitle}</div>
        </button>
      </div>
    )
  }

  renderFirstStep () {
    const { deposit, token } = this.props
    const bottoms = {
      bottomLeft: {
        onClick: () => {
          this.setState({
            step: LABOR_X_CONNECT_SECOND,
          })
        },
        topValue: new Amount(2, 'LHT'),
        bottom: {
          styleName: 'blue',
          title: 'Use Our Node',
        },
      },
      bottomRight: {
        onClick: () => {
          this.setState({
            step: LABOR_X_CONNECT_SECOND,
          })
        },
        topValue: new Amount(3, 'LHT'),
        bottom: {
          styleName: 'red',
          title: 'Use Custom Node',
          subTitle: 'Min deposit: 1,000',
        },
      },
    }

    return (
      <div>
        <div styleName={classnames('fieldWrapper')}>
          {deposit.gt(0) && token.decimals() > 0
            ? (
              <Field
                component={LaborXConnectSlider}
                name='amount'
                toFixed={1}
                min={0}
                step={token.addDecimals(new BigNumber(1)).toNumber()}
                max={deposit.toNumber()}
                token={token}
              />
            )
            : (
              <Preloader />
            )
          }
        </div>
        <div styleName='actions'>
          {Object.entries(bottoms).map((entry) => {
            return this.renderButton(entry)
          })}
        </div>
      </div>
    )
  }

  renderSecondStep () {
    const buttons = [
      {
        title: 'nodes.winNode',
        onClick: () => {

        },
      },
      {
        title: 'nodes.macNode',
        onClick: () => {

        },
      },
      {
        title: 'nodes.linuxNode',
        onClick: () => {

        },
      },
    ]
    return (
      <div styleName='downloadButtons'>
        {buttons.map((button) => {
          return <button>{button.title}</button>
        })}
      </div>
    )
  }

  render () {
    return (
      <div styleName='root'>
        <form onSubmit={this.props.handleSubmit}>
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
