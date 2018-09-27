/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import IPFSImage from 'components/common/IPFSImage/IPFSImage'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import WalletModel from '@chronobank/core/models/wallet/WalletModel'
import { BLOCKCHAIN_ETHEREUM } from '@chronobank/core/dao/constants'
import { connect } from 'react-redux'
import { EOS } from '@chronobank/core/redux/eos/constants'
import { EOSPendingSelector, getEOSWallet } from '@chronobank/core/redux/eos/selectors/mainSelectors'
import { Link } from 'react-router'
import { selectWallet } from '@chronobank/core/redux/wallet/actions'
import { TOKEN_ICONS } from 'assets'
import { Translate } from 'react-redux-i18n'
import './EOSWalletWidgetMini.scss'
import EOSWalletWidgetMiniUsdAmount from './EOSWalletWidgetMiniUsdAmount'
import SubIconForWallet from '../SubIconForWallet/SubIconForWallet'
import WalletName from '../WalletName/WalletName'
import { prefix } from './lang'

function makeMapStateToProps (state, ownProps) {
  const getWallet = getEOSWallet(`${ownProps.blockchain}-${ownProps.address}`)
  const getTransactions = EOSPendingSelector()

  return (ownState) => {
    return {
      wallet: getWallet(ownState),
      pendingTransactions: getTransactions(ownState), // TODO check this props
    }
  }
}

function mapDispatchToProps (dispatch) {
  return {
    selectWallet: (blockchain, address) => dispatch(selectWallet(blockchain, address)),
  }
}

@connect(makeMapStateToProps, mapDispatchToProps)
export default class EOSWalletWidgetMini extends PureComponent {
  static propTypes = {
    wallet: PropTypes.instanceOf(WalletModel),
    selectWallet: PropTypes.func,
  }

  handleSelectWallet = () => {
    const { wallet } = this.props
    this.props.selectWallet(wallet.blockchain, wallet.address)
  }

  render () {
    const { wallet } = this.props
    const mainBalance = wallet.balances[EOS]

    return (
      <div styleName='container'>
        <div styleName='wallet-list-container'>
          <div styleName='wallet-container'>
            <div styleName='main-info'>
              <div styleName='token-container'>
                {wallet.blockchain === BLOCKCHAIN_ETHEREUM && <SubIconForWallet wallet={wallet} />}
                <div styleName='token-icon'>
                  <IPFSImage styleName='image' fallback={TOKEN_ICONS[EOS] || TOKEN_ICONS.DEFAULT} />
                </div>
              </div>
              <div styleName='content-container'>
                <Link styleName='addressWrapper' href='' to='/wallet' onClick={this.handleSelectWallet}>
                  <div styleName='address-title'>
                    <div><WalletName wallet={wallet} /></div>
                    <span styleName='address-address'>{wallet.address}</span>
                  </div>
                </Link>
                <div styleName='amount'>
                  <div styleName='amount-crypto'> {mainBalance.symbol()}&nbsp;{mainBalance.toFixed(4)}</div>
                  <div styleName='amount-fiat'><EOSWalletWidgetMiniUsdAmount wallet={wallet} /></div>
                  <div styleName='amount-fiat'><Translate value={`${prefix}.tokensCount`} count={Object.keys(wallet.balances).length} /></div>
                </div>
              </div>
            </div>
            {wallet.pendingCount > 0 && (
              <div styleName='additional-info'>
                <div styleName='pendings-container'>
                  <div styleName='pendings-icon'><Translate value={`${prefix}.pending`} count={wallet.pendingCount} /></div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }
}
