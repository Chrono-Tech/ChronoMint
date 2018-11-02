/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { FEE_RATE_MULTIPLIER } from '@chronobank/core/redux/wallets/constants'
import { Switch } from 'redux-form-material-ui'
import Button from 'components/common/ui/Button/Button'
import Amount from '@chronobank/core/models/Amount'
import AssetsCollection from '@chronobank/core/models/assetHolder/AssetsCollection'
import TokenModel from '@chronobank/core/models/tokens/TokenModel'
import { TX_LOCK, TX_UNLOCK } from '@chronobank/core/dao/constants/AssetHolderDAO'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { Translate } from 'react-redux-i18n'
import { Field, formPropTypes, reduxForm } from 'redux-form/immutable'
import { FORM_LABOR_X_CONNECT_SETTINGS } from 'components/constants'
import classnames from 'classnames'
import validate from './validate'
import { prefix } from './lang'
import LaborXConnectSlider from './LaborXConnectSlider/LaborXConnectSlider'
import './LaborXConnect.scss'

@reduxForm({ form: FORM_LABOR_X_CONNECT_SETTINGS, validate })
export default class LaborXConnectSettingsForm extends PureComponent {
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

  handleProceed = (values) => {
    this.props.onSubmit(values.set('action', TX_LOCK).set('token', this.props.token))
  }

  handleUnlock = (values) => {
    this.props.onSubmit(values.set('action', TX_UNLOCK).set('token', this.props.token))
  }

  renderHead () {
    return (
      <div styleName='head'>
        <div styleName='mainTitle'>
          <Translate value={`${prefix}.settingsForm.title`} />
        </div>
        <div styleName='headContent'>
          <Translate value={`${prefix}.settingsForm.message`} />
        </div>
      </div>
    )
  }

  renderBody () {
    return (
      <div styleName='body'>
        <div styleName='fieldWrapper'>
          <Field component={LaborXConnectSlider} name='amount' {...FEE_RATE_MULTIPLIER} toFixed={1} />
        </div>
        <div styleName={classnames('fieldWrapper', 'customNodeWrapper')}>
          <div styleName='title'>
            <Translate value={`${prefix}.settingsForm.customNode`} amount={10} />
          </div>
          <div styleName='switcher'>
            <Field
              styleName='customNodeSwitcher'
              component={Switch}
              name='isCustomNode'
              color='primary'
            />
          </div>
        </div>
        <div styleName={classnames('fieldWrapper', 'reward')}>
          <Translate value={`${prefix}.settingsForm.reward`} symbol='LHT' amount='10' />
        </div>
        <div styleName={classnames('fieldWrapper', 'nodes')}>
          <div>
            <Translate value={`${prefix}.nodes.winNode`} />
            :&nbsp;
            <span>
              <Translate value={`${prefix}.settingsForm.download`} />
            </span>
          </div>
          <div>
            <Translate value={`${prefix}.nodes.macNode`} />
            :&nbsp;
            <span>
              <Translate value={`${prefix}.settingsForm.download`} />
            </span>
          </div>
          <div>
            <Translate value={`${prefix}.nodes.linuxNode`} />
            :&nbsp;
            <span>
              <Translate value={`${prefix}.settingsForm.download`} />
            </span>
          </div>
        </div>
      </div>
    )
  }

  renderFooter () {
    return (
      <div styleName='footer'>
        <Button onClick={this.props.onSubmit}>
          <Translate value={`${prefix}.accept`} />
        </Button>
      </div>
    )
  }

  render () {
    return (
      <div styleName='root'>
        <form onSubmit={this.props.handleSubmit}>
          {this.renderHead()}
          {this.renderBody()}
          {this.renderFooter()}
        </form>
      </div>
    )
  }
}
