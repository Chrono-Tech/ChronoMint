/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import PropTypes from 'prop-types'
import { Translate } from 'react-redux-i18n'
import React, { PureComponent } from 'react'
import TokensCollection from 'models/tokens/TokensCollection'
import Preloader from 'components/common/Preloader/Preloader'

import { prefix } from './lang'
import './OwnersListWidget.scss'

export default class OwnersListWidget extends PureComponent {
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
    }),
    revoke: PropTypes.func,
    confirm: PropTypes.func,
    getPendingData: PropTypes.func,
    tokens: PropTypes.instanceOf(TokensCollection),
    locale: PropTypes.string,
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

    if (!wallet.isMultisig) {
      return null
    }

    return (
      <div styleName='root' className='PendingTxWidget__root'>
        <div styleName='header'>
          <Translate value={`${prefix}.title`} />
        </div>
        <div styleName='body'>
          {!wallet
            ? <Preloader />
            : wallet.owners.map((item) => this.renderRow(item))
          }
          <div styleName='signatures'><Translate value={`${prefix}.signatures`} s1={wallet.requiredSignatures} s2={wallet.owners.length} /></div>
        </div>
      </div>
    )
  }
}

