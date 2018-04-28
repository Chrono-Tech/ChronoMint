/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { Translate } from 'react-redux-i18n'

import './SelectEthWallet.scss'
import { prefix } from '../lang'

export default class SelectEthWallet extends PureComponent {
  static propTypes = {
    handleTouchTap: PropTypes.func,
  }

  handleTouchTap = (type) => () => {
    this.props.handleTouchTap(type)
  }

  render () {
    const wallets = [
      {
        title: `${prefix}.st.title`,
        type: 'ST',
        icon: 'wallet',
        description: `${prefix}.st.description`,
      },
      {
        title: `${prefix}.tl.title`,
        type: 'TL',
        icon: 'time-lock',
        description: `${prefix}.tl.description`,
      },
      {
        title: `${prefix}.fa.title`,
        type: '2FA',
        icon: 'security',
        description: `${prefix}.fa.description`,
      },
      {
        title: `${prefix}.ms.title`,
        type: 'MS',
        icon: 'people',
        description: `${prefix}.ms.description`,
      },
      {
        title: `${prefix}.cw.title`,
        type: 'CW',
        icon: 'advanced-circle',
        description: `${prefix}.cw.description`,
      },
    ]

    return (
      <div styleName='root'>
        {
          wallets.map((type) => (
            <div key={type.type} styleName='walletType' onTouchTap={this.handleTouchTap(type.type)}>
              <div styleName='icon'><i className='chronobank-icon'>{type.icon}</i></div>
              <div styleName='info'>
                <div styleName='title'><Translate value={type.title} /></div>
                <div styleName='description'><Translate value={type.description} /></div>
              </div>
              <div styleName='arrow'><i className='chronobank-icon'>next</i></div>
            </div>
          ))
        }
      </div>
    )
  }
}
