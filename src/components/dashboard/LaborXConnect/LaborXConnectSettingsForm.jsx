/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import BigNumber from 'bignumber.js'
import { Switch } from 'redux-form-material-ui'
import Button from 'components/common/ui/Button/Button'
import Amount from '@chronobank/core/models/Amount'
import AssetsCollection from '@chronobank/core/models/assetHolder/AssetsCollection'
import TokenModel from '@chronobank/core/models/tokens/TokenModel'
import { TIME } from '@chronobank/core/dao/constants'
import {
  TX_LOCK,
  TX_UNLOCK,
} from '@chronobank/core/dao/constants/AssetHolderDAO'
import WalletModel from '@chronobank/core/models/wallet/WalletModel'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { Translate } from 'react-redux-i18n'
import { Field, formPropTypes, reduxForm } from 'redux-form/immutable'
import { FORM_LABOR_X_CONNECT_SETTINGS } from 'components/constants'
import classnames from 'classnames'
import validate from './validate'
import { prefix } from './lang'
import LaborXConnectSlider from './LaborXConnectSlider/LaborXConnectSlider'
import Preloader from '../../common/Preloader/Preloader'
import './LaborXConnect.scss'
import TokenValueSimple from '../../common/TokenValueSimple/TokenValueSimple'

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
    lhtWallet: PropTypes.instanceOf(WalletModel),
    depositParams: PropTypes.objectOf(PropTypes.string),
    ...formPropTypes,
  }

  handleProceed = (values) => {
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
    const { deposit, token, lhtWallet, depositParams, amount } = this.props
    const { rewardsCoefficient, minDepositLimit } = depositParams
    // TODO @abdulov remove console.log
    console.log('%c this.props', 'background: #222; color: #fff', this.props)
    // TODO @abdulov remove console.log
    console.log('%c amount', 'background: #222; color: #fff', amount)
    const amountBN = new BigNumber(amount)
    const max = lhtWallet.balances[TIME]
      ? lhtWallet.balances[TIME].plus(deposit)
      : deposit
    return (
      <div styleName='body'>
        <div styleName='fieldWrapper'>
          {deposit.gt(0) && token.decimals() > 0 ? (
            <Field
              component={LaborXConnectSlider}
              name='amount'
              toFixed={1}
              min={0}
              step={token.addDecimals(new BigNumber(1)).toNumber()}
              max={max.toNumber()}
              token={token}
            />
          ) : (
            <Preloader />
          )}
        </div>
        <div styleName={classnames('fieldWrapper', 'customNodeWrapper')}>
          <div styleName='title'>
            <Translate value={`${prefix}.settingsForm.customNode`} />(
            <Translate value={`${prefix}.settingsForm.minDeposit`} />{' '}
            <TokenValueSimple value={new Amount(minDepositLimit, TIME)} />)
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
          <Translate value={`${prefix}.settingsForm.reward`} />
          <TokenValueSimple value={new Amount(amountBN.mul(rewardsCoefficient), 'LHT')} />
          {' / '}
          <Translate value={`${prefix}.settingsForm.block`} />
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
