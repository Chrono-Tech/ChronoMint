/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import PropTypes from 'prop-types'
import MultisigWalletModel from 'models/wallet/MultisigWalletModel'
import React, { PureComponent } from 'react'
import MainWalletModel from 'models/wallet/MainWalletModel'

import './SubIconForWallet.scss'

export default class SubIconForWallet extends PureComponent {
  static propTypes = {
    wallet: PropTypes.oneOfType([
      PropTypes.instanceOf(MainWalletModel),
      PropTypes.instanceOf(MultisigWalletModel),
    ]),
  }

  render () {
    const { wallet } = this.props
    let icon = 'wallet-circle'
    if (wallet.isMultisig()) {
      if (wallet.is2FA && wallet.is2FA()) {
        icon = 'security-circle'
      } else if (wallet.isTimeLocked()) {
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
