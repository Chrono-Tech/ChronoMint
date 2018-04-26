/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import PropTypes from 'prop-types'
import { Translate } from 'react-redux-i18n'
import React, { PureComponent } from 'react'
import TokensCollection from 'models/tokens/TokensCollection'
import MultisigWalletModel from 'models/wallet/MultisigWalletModel'
import Preloader from 'components/common/Preloader/Preloader'
import OwnerModel from 'models/wallet/OwnerModel'

import { prefix } from './lang'
import './OwnersListWidget.scss'

export default class OwnersListWidget extends PureComponent {
  static propTypes = {
    wallet: PropTypes.instanceOf(MultisigWalletModel),
    revoke: PropTypes.func,
    confirm: PropTypes.func,
    getPendingData: PropTypes.func,
    tokens: PropTypes.instanceOf(TokensCollection),
    locale: PropTypes.string,
  }

  renderRow (item: OwnerModel) {
    return (
      <div styleName='row' key={item.id()}>
        <div styleName='rowTable'>
          <div styleName='iconWrapper'>
            <i className='chronobank-icon'>profile</i>
          </div>
          <div styleName='values'>{item.address()}</div>
        </div>
      </div>
    )
  }

  render () {
    const { wallet } = this.props

    return (
      <div styleName='root' className='PendingTxWidget__root'>
        <div styleName='header'>
          <Translate value={`${prefix}.title`} />
        </div>
        <div styleName='body'>
          {!wallet
            ? <Preloader />
            : wallet.owners().items().map((item) => this.renderRow(item))
          }
          <div styleName='signatures'><Translate value={`${prefix}.signatures`} s1={wallet.requiredSignatures()} s2={wallet.owners().size()} /></div>
        </div>
      </div>
    )
  }
}

