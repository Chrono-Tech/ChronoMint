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
import TokenValueSimple from 'components/common/TokenValueSimple/TokenValueSimple'
import Preloader from 'components/common/Preloader/Preloader'
import { CHRONOBANK_NODE_FEE_COEFFICIENT } from '@chronobank/core/redux/laborHour/constants'
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
    lhtWallet: PropTypes.instanceOf(WalletModel),
    miningParams: PropTypes.objectOf(PropTypes.string),
    isCustomNode: PropTypes.bool,
    ...formPropTypes,
  }

  handleProceed = (values) => {
    const { lhtWallet } = this.props

    const realValue = new BigNumber(values.get('amount')).minus(
      lhtWallet.balances[TIME]
    )
    const isCustomNode = values.get('isCustomNode')
    let resultValues

    if (realValue.eq(0)) {
      if (isCustomNode) {
        // use custom node
      } else {
        // use our pull
      }
      // change node
      // TODO @abdulov remove console.log
      console.log('%c 0', 'background: #222; color: #fff')
    }

    if (realValue.gt(0)) {
      // increase deposit
      resultValues = values.set('amount', realValue).set('action', TX_LOCK)
    }
    if (realValue.lt(0)) {
      // withdraw tokens to mainnet
      resultValues = values
        .set('amount', realValue.abs())
        .set('action', TX_UNLOCK)
    }

    this.props.onSubmit(resultValues.set('token', this.props.token))
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
    const {
      deposit,
      token,
      lhtWallet,
      miningParams,
      amount,
      isCustomNode,
    } = this.props
    const { rewardsCoefficient, minDepositLimit } = miningParams
    const amountBN = new BigNumber(amount)
    const max = lhtWallet.balances[TIME]
      ? lhtWallet.balances[TIME].plus(deposit)
      : deposit

    const rewardPerBlock = new Amount(
      amountBN.mul(rewardsCoefficient),
      'LHT'
    ).mul(isCustomNode ? 1 : CHRONOBANK_NODE_FEE_COEFFICIENT) // chronobank fee
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
          <TokenValueSimple value={rewardPerBlock} withFraction />
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
        <Button onClick={this.props.handleSubmit(this.handleProceed)}>
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
