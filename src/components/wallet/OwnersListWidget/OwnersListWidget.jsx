/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import PropTypes from 'prop-types'
import { Translate } from 'react-redux-i18n'
import React, { PureComponent } from 'react'
import Preloader from 'components/common/Preloader/Preloader'
import { PTWallet } from '@chronobank/core/redux/wallet/types'

import { prefix } from './lang'
import './OwnersListWidget.scss'

export default class OwnersListWidget extends PureComponent {
  static propTypes = {
    wallet: PropTypes.instanceOf(PTWallet),
  }

  renderRow (item: string) {
    return (
      <div styleName='row' key={item}>
        <div styleName='rowTable'>
          <div styleName='iconWrapper'>
            <i className='chronobank-icon'>profile</i>
          </div>
          <div styleName='values'>{item}</div>
        </div>
      </div>
    )
  }

  render () {
    const { wallet } = this.props

    if (wallet && !wallet.isMultisig) {
      return null
    }

    return (
      <div styleName='root' className='PendingTxWidget__root'>
        <div styleName='header'>
          <Translate value={`${prefix}.title`} />
        </div>
        <div styleName='body'>
          {wallet
            ? wallet.owners.map((item) => this.renderRow(item))
            : <Preloader />
          }
          <div styleName='signatures'>
            <Translate
              value={`${prefix}.signatures`}
              s1={wallet && wallet.requiredSignatures}
              s2={wallet && wallet.owners.length}
            />
          </div>
        </div>
      </div>
    )
  }
}

