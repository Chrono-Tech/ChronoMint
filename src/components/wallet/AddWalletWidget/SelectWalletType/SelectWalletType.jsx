/**
 * Copyright 2017–2019, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import React, { PureComponent } from 'react'
import classnames from 'classnames'
import { Translate } from 'react-redux-i18n'
import IPFSImage from 'components/common/IPFSImage/IPFSImage'
import { TOKEN_ICONS } from 'assets'
import { resetWalletsForm } from 'redux/ui/thunks'
import { navigateToWallets } from 'redux/ui/navigation'
import { createNewChildAddress } from '@chronobank/core/redux/wallets/actions'
import {
  BLOCKCHAIN_BITCOIN,
  BLOCKCHAIN_DASH,
  BLOCKCHAIN_ETHEREUM,
  BLOCKCHAIN_LABOR_HOUR,
  BLOCKCHAIN_LITECOIN,
  BLOCKCHAIN_NEM,
  BLOCKCHAIN_WAVES,
  BTC,
  DASH,
  ETH,
  LHT,
  LTC,
  WAVES,
  XEM,
} from '@chronobank/core/dao/constants'
import { getBlockchainList } from '@chronobank/core/redux/persistAccount/selectors'
import { prefix } from '../lang'
import './SelectWalletType.scss'

function mapStateToProps (state) {
  return {
    blockchains: getBlockchainList(state),
  }
}

function mapDispatchToProps (dispatch) {
  return {
    onCreateWallet: (blockchain) => {
      dispatch(createNewChildAddress({ blockchain }))
      dispatch(navigateToWallets())
      dispatch(resetWalletsForm())
    },
  }
}

@connect(mapStateToProps, mapDispatchToProps)
export default class SelectWalletType extends PureComponent {
  static propTypes = {
    blockchains: PropTypes.arrayOf(PropTypes.string),
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

  wallets = [
    {
      blockchain: BLOCKCHAIN_BITCOIN,
      symbol: BTC,
      title: `${prefix}.btc`,
      disabled: true,
    },
    {
      blockchain: BLOCKCHAIN_DASH,
      symbol: DASH,
      title: `${prefix}.dash`,
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
      blockchain: BLOCKCHAIN_LABOR_HOUR,
      symbol: LHT,
      title: `${prefix}.lht`,
      disabled: true,
    },
    {
      blockchain: BLOCKCHAIN_NEM,
      symbol: XEM,
      title: `${prefix}.nem`,
      disabled: true,
    },
    {
      blockchain: BLOCKCHAIN_WAVES,
      symbol: WAVES,
      title: `${prefix}.waves`,
      disabled: true,
    },
  ]

  render () {
    const { blockchains } = this.props

    return (
      <div styleName='root'>
        {
          this.wallets
            .filter(({ blockchain }) => blockchains.includes(blockchain))
            .map((type) => (
              <div key={type.blockchain} styleName={classnames('walletType', { 'disabled': type.disabled })} onClick={type.action || this.handleTouchTap(type)}>
                <div styleName='icon'><IPFSImage fallback={TOKEN_ICONS[type.symbol]} /></div>
                <div styleName='title'>
                  <Translate value={type.title} />
                  {type.disabled && <div styleName='soon'><Translate value={`${prefix}.soon`} /></div>}
                </div>
                <div styleName='arrow'><i className='chronobank-icon'>next</i></div>
              </div>
            ))
        }
      </div>
    )
  }
}
