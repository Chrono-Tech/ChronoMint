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
import { BLOCKCHAIN_BITCOIN, BLOCKCHAIN_LITECOIN } from '@chronobank/login/network/BitcoinProvider'
import { BLOCKCHAIN_ETHEREUM } from 'dao/EthereumDAO'
import { BLOCKCHAIN_NEM } from 'dao/NemDAO'
import { BTC, ETH, LTC, XEM } from 'redux/mainWallet/actions'

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
        blockchain: BLOCKCHAIN_BITCOIN,
        symbol: BTC,
        title: `${prefix}.btc`,
        disabled: true,
      },
      {
        blockchain: BLOCKCHAIN_LITECOIN,
        symbol: LTC,
        title: `${prefix}.ltc`,
        disabled: true,
      },
      {
        blockchain: BLOCKCHAIN_ETHEREUM,
        symbol: ETH,
        title: `${prefix}.eth`,
        disabled: false,
      },
      {
        blockchain: BLOCKCHAIN_NEM,
        symbol: XEM,
        title: `${prefix}.nem`,
        disabled: true,
      },
    ]

    return (
      <div styleName='root'>
        {
          wallets.map((type) => (
            <div key={type.blockchain} styleName={classnames('walletType', { 'disabled': type.disabled })} onTouchTap={this.handleTouchTap(type.blockchain)}>
              <div styleName='icon'><IPFSImage fallback={TOKEN_ICONS[ type.symbol ]} /></div>
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
