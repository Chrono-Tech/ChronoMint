/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import PropTypes from 'prop-types'
import TokenModel from '@chronobank/core/models/tokens/TokenModel'
import { Link } from 'react-router'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { selectWallet } from '@chronobank/core/redux/wallet/actions'
import { getWalletInfo } from '@chronobank/core/redux/wallets/selectors/wallet'
import { Translate } from 'react-redux-i18n'
import { TOKEN_ICONS } from 'assets'
import IPFSImage from 'components/common/IPFSImage/IPFSImage'
import { getMainSymbolForBlockchain, getTokens } from '@chronobank/core/redux/tokens/selectors'
import { BLOCKCHAIN_ETHEREUM } from '@chronobank/core/dao/constants'
import TokenValueSimple from 'components/common/TokenValueSimple/TokenValueSimple'
import { PTWallet } from '@chronobank/core/redux/wallet/types'
import './WalletWidgetMini.scss'
import { prefix } from './lang'
import SubIconForWallet from '../SubIconForWallet/SubIconForWallet'
import WalletWidgetMiniUsdAmount from './WalletWidgetMiniUsdAmount'
import WalletTokensCount from './WalletTokensCount'
import WalletName from '../WalletName/WalletName'

function makeMapStateToProps (state, ownProps) {
  const getWallet = getWalletInfo(ownProps.blockchain, ownProps.address)
  const mapStateToProps = (ownState) => {
    const tokens = getTokens(ownState)
    return {
      wallet: getWallet(ownState),
      token: tokens.item(getMainSymbolForBlockchain(ownProps.blockchain)),
    }
  }
  return mapStateToProps
}

function mapDispatchToProps (dispatch) {
  return {
    selectWallet: (blockchain, address) => dispatch(selectWallet(blockchain, address)),
  }
}

@connect(makeMapStateToProps, mapDispatchToProps)
export default class WalletWidgetMini extends PureComponent {
  static propTypes = {
    blockchain: PropTypes.string,
    wallet: PTWallet,
    address: PropTypes.string,
    token: PropTypes.instanceOf(TokenModel),
    selectWallet: PropTypes.func,
    showGroupTitle: PropTypes.bool,
  }

  handleSelectWallet = () => {
    const { address, blockchain } = this.props
    this.props.selectWallet(blockchain, address)
  }

  render () {
    const { address, token, blockchain, wallet, showGroupTitle } = this.props

    return (
      <div styleName='container'>
        {showGroupTitle && <h1 styleName='header-text' id={blockchain}><Translate value={`${prefix}.walletTitle`} title={blockchain} /></h1>}
        <div styleName='wallet-list-container'>
          <div styleName='wallet-container'>
            <div styleName='main-info'>
              <div styleName='token-container'>
                {blockchain === BLOCKCHAIN_ETHEREUM && <SubIconForWallet wallet={wallet} />}
                <div styleName='token-icon'>
                  <IPFSImage styleName='image' multihash={token.icon()} fallback={TOKEN_ICONS[token.symbol()] || TOKEN_ICONS.DEFAULT} />
                </div>
              </div>
              <div styleName='content-container'>
                <Link styleName='addressWrapper' href='' to='/wallet' onClick={this.handleSelectWallet}>
                  <div styleName='address-title'>
                    <div><WalletName wallet={wallet} /></div>
                    <span styleName='address-address'>{address}</span>
                  </div>
                </Link>
                <div styleName='amount'>
                  <div styleName='amount-crypto'> {token.symbol()}&nbsp;<TokenValueSimple value={wallet.amount} withFraction /></div>
                  <div styleName='amount-fiat'><WalletWidgetMiniUsdAmount wallet={wallet} /></div>
                  <div styleName='amount-fiat'><WalletTokensCount wallet={wallet} /></div>
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
