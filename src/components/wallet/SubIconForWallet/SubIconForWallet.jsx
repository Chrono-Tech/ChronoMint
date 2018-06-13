/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { PTWallet } from 'redux/wallet/types'
import React, { PureComponent } from 'react'

import './SubIconForWallet.scss'

export default class SubIconForWallet extends PureComponent {
  static propTypes = {
    wallet: PTWallet,
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
