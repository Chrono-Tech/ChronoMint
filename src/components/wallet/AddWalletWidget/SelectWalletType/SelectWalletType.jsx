/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import React, { PureComponent } from 'react'
import classnames from 'classnames'
import { Translate } from 'react-redux-i18n'
import { IPFSImage } from 'components'
import { TOKEN_ICONS } from 'assets'
import { BLOCKCHAIN_BITCOIN, BLOCKCHAIN_LITECOIN } from '@chronobank/login/network/BitcoinProvider'
import { BTC, createNewChildAddress, ETH, goToWallets, LTC, resetWalletsForm, XEM } from 'redux/mainWallet/actions'
import { BLOCKCHAIN_ETHEREUM } from 'dao/EthereumDAO'
import { BLOCKCHAIN_NEM } from 'dao/NemDAO'

import './SelectWalletType.scss'
import { prefix } from '../lang'

function mapStateToProps () {
  return {}
}

function mapDispatchToProps (dispatch) {
  return {
    onCreateWallet: (blockchain) => {
      dispatch(createNewChildAddress({ blockchain }))
      dispatch(goToWallets())
      dispatch(resetWalletsForm())
    },
  }
}

@connect(mapStateToProps, mapDispatchToProps)
export default class SelectWalletType extends PureComponent {
  static propTypes = {
    handleTouchTap: PropTypes.func,
    onCreateWallet: PropTypes.func,
  }

  handleTouchTap = (type) => () => {
    if (!type.disabled) {
      this.props.handleTouchTap(type.blockchain)
    }
  }

  handleCreateWallet = (blockchain) => () => {
    this.props.onCreateWallet(blockchain)
  }

  render () {
    const wallets = [
      {
        blockchain: BLOCKCHAIN_BITCOIN,
        symbol: BTC,
        title: `${prefix}.btc`,
        action: this.handleCreateWallet(BLOCKCHAIN_BITCOIN),
      },
      {
        blockchain: BLOCKCHAIN_LITECOIN,
        symbol: LTC,
        title: `${prefix}.ltc`,
        action: this.handleCreateWallet(BLOCKCHAIN_LITECOIN),
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
            <div key={type.blockchain} styleName={classnames('walletType', { 'disabled': type.disabled })} onTouchTap={type.action || this.handleTouchTap(type)}>
              <div styleName='icon'><IPFSImage fallback={TOKEN_ICONS[ type.symbol ]} /></div>
              <div styleName='title'>
                <Translate value={type.title} />
                {type.disabled && <div styleName='soon'><Translate value={`${prefix}.soon`} /></div>}
              </div>
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
