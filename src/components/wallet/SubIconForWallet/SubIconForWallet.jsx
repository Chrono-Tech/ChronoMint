/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'

import './SubIconForWallet.scss'

export default class SubIconForWallet extends PureComponent {
  static propTypes = {
    wallet: PropTypes.shape({
      address: PropTypes.string,
      blockchain: PropTypes.string,
      name: PropTypes.string,
      requiredSignatures: PropTypes.number,
      pendingCount: PropTypes.number,
      isMultisig: PropTypes.bool,
      isTimeLocked: PropTypes.bool,
      is2FA: PropTypes.bool,
      isDerived: PropTypes.bool,
      customTokens: PropTypes.arrayOf(),
    }),
  }

  render () {
    const { wallet } = this.props
    if (!wallet.isMultisig && !wallet.isTimeLocked) {
      return null
    }

    let icon = 'wallet-circle'
    if (wallet.isMultisig) {
      if (wallet.is2FA) {
        icon = 'security-circle'
      } else if (wallet.isTimeLocked) {
        icon = 'time-lock'
      } else {
        icon = 'multisig'
      }
    }
    return (
      <div styleName='root' className='SubIconForWallet_root'>
        <div styleName='icon' className='chronobank-icon'>{icon}</div>
      </div>
    )
  }
}
