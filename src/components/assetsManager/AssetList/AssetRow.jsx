/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import React, { PureComponent } from 'react'
import Amount from '@chronobank/core/models/Amount'
import PropTypes from 'prop-types'
import { ASSET_STATUS_ACTIVE, ASSET_STATUS_BLOCKED } from './constants'

import './AssetRow.scss'

export default class AssetRow extends PureComponent {
  static propTypes = {
    name: PropTypes.string,
    iconSVG: PropTypes.string,
    amount: PropTypes.instanceOf(Amount),
    status: PropTypes.oneOf([ASSET_STATUS_ACTIVE, ASSET_STATUS_BLOCKED]),
    managers: PropTypes.arrayOf(PropTypes.string),
  }

  render () {
    const { name, iconSVG, amount, status, managers } = this.props

    return (
      <div styleName='container'>
        <div styleName='asset-cell icon-container'>
          <img src={iconSVG} styleName='asset-icon' />
        </div>
        <div styleName='asset-cell name-amount'>
          {name + ' ' + amount}
        </div>
        <div styleName='asset-cell managers'>
          {`${managers.length} managers`/* @todo as Translate */}
        </div>
        <div styleName='asset-cell'>
          <div styleName={'status-button ' + status}>
            {status}
          </div>
        </div>
      </div>
    )
  }
}
