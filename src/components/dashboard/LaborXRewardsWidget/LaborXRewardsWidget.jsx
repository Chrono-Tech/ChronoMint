/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { Translate } from 'react-redux-i18n'
import Amount from '@chronobank/core/models/Amount'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import TokenModel from '@chronobank/core/models/tokens/TokenModel'
import AssetsCollection from '@chronobank/core/models/assetHolder/AssetsCollection'
import { prefix } from './lang'
import './LaborXRewardsWidget.scss'

export default class LaborXRewardsWidget extends PureComponent {
  static propTypes = {
    deposit: PropTypes.instanceOf(Amount),
    lockDeposit: PropTypes.func,
    sidechainWithdraw: PropTypes.func,
    balanceEth: PropTypes.instanceOf(Amount),
    token: PropTypes.instanceOf(TokenModel),
    assets: PropTypes.instanceOf(AssetsCollection),
    initAssetsHolder: PropTypes.func,
    handleSubmitSuccess: PropTypes.func,
    onChangeField: PropTypes.func,
    amount: PropTypes.number,
  }

  render () {
    return (
      <div styleName='root'>
        <div styleName='header'>
          <div styleName='title'><Translate value={`${prefix}.title`} /></div>
          <div styleName='subTitle'><Translate value={`${prefix}.subTitle`} /></div>
        </div>
        <div styleName='table'>
          <div styleName='tableHeader'>
            <div styleName='column'><Translate value={`${prefix}.date`} /></div>
            <div styleName='column'><Translate value={`${prefix}.block`} /></div>
            <div styleName='column'><Translate value={`${prefix}.reward`} /></div>
          </div>
          <div styleName='tableBody'>
            <div styleName='row'>
              <div styleName='column'> 12 Feb 2018, 10:00 PM</div>
              <div styleName='column'>546821</div>
              <div styleName='column'>LHT 0.02</div>
            </div>
            <div styleName='row'>
              <div styleName='column'> 12 Feb 2018, 10:00 PM</div>
              <div styleName='column'>546821</div>
              <div styleName='column'>LHT 0.02</div>
            </div>
            <div styleName='row'>
              <div styleName='column'> 12 Feb 2018, 10:00 PM</div>
              <div styleName='column'>546821</div>
              <div styleName='column'>LHT 0.02</div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
