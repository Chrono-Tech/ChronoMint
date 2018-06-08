/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Translate } from 'react-redux-i18n'
import { prefix } from './lang'

export default class WalletName extends PureComponent {
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
      owners: PropTypes.arrayOf(PropTypes.string),
      customTokens: PropTypes.arrayOf(),
    }).isRequired,
  }

  getWalletName = () => {
    const { wallet } = this.props
    const name = wallet.name
    if (name) {
      return name
    }

    let key = null
    if (this.isMy2FAWallet()) {
      key = 'twoFAWallet'
    } else {
      if (this.isMySharedWallet()) {
        key = 'sharedWallet'
      } else {
        if (this.isLockedWallet()) {
          key = 'lockedWallet'
        } else {
          if (wallet.isDerived) {
            key = wallet.customTokens ? 'customWallet' : 'additionalStandardWallet'
          } else {
            key = 'standardWallet'
          }
        }
      }
    }
    return <Translate value={`${prefix}.${key}`} />
  }

  isMySharedWallet = () => {
    return this.props.wallet.isMultisig && !this.props.wallet.isTimeLocked && !this.props.wallet.is2FA
  }

  isMy2FAWallet = () => {
    return this.props.wallet.isMultisig && this.props.wallet.is2FA
  }

  isLockedWallet = () => {
    return this.props.wallet.isMultisig && this.props.wallet.isTimeLocked
  }

  render () {
    return <span>{this.getWalletName()}</span>
  }
}
