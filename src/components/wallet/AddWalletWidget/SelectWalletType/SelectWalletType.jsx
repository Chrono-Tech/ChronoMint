/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import classnames from 'classnames'
import { Translate } from 'react-redux-i18n'
import { IPFSImage } from 'components'
import { TOKEN_ICONS } from 'assets'

import './SelectWalletType.scss'
import { prefix } from '../lang'

export default class SelectWalletType extends PureComponent {
  static propTypes = {
    handleTouchTap: PropTypes.func,
  }

  handleTouchTap = (type) => () => {
    this.props.handleTouchTap(type)
  }

  render () {
    const wallets = [
      {
        type: 'BTC',
        title: `${prefix}.btc`,
        disabled: true,
      },
      {
        type: 'LTC',
        title: `${prefix}.ltc`,
        disabled: true,
      },
      {
        type: 'ETH',
        title: `${prefix}.eth`,
        disabled: false,
      },
      {
        type: 'XEM',
        title: `${prefix}.nem`,
        disabled: true,
      },
    ]

    return (
      <div styleName='root'>
        {
          wallets.map((type) => (
            <div key={type.type} styleName={classnames('walletType', { 'disabled': type.disabled })} onTouchTap={this.handleTouchTap(type.type)}>
              <div styleName='icon'><IPFSImage fallback={TOKEN_ICONS[ type.type ]} /></div>
              <div styleName='title'><Translate value={type.title} /></div>
              <div styleName='arrow'><i className='chronobank-icon'>next</i></div>
            </div>
          ))
        }
        <div styleName='walletType'>
          <div styleName='icon' />
          <div styleName='title'><Translate value={`${prefix}.lgo`} /></div>
          <div styleName='arrow' />
        </div>
      </div>
    )
  }
}
