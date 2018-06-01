/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import PropTypes from 'prop-types'
import TokenModel from 'models/tokens/TokenModel'
import { Link } from 'react-router'
import MultisigWalletModel from 'models/wallet/MultisigWalletModel'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { selectWallet } from 'redux/wallet/actions'
import { modalsOpen } from 'redux/modals/actions'
import { Translate } from 'react-redux-i18n'
import { getWallet, walletInfoSelector } from 'redux/wallet/selectors'
import { TOKEN_ICONS } from 'assets'
import { DUCK_TOKENS } from 'redux/tokens/actions'
import IPFSImage from 'components/common/IPFSImage/IPFSImage'
import TokensCollection from 'models/tokens/TokensCollection'
import MainWalletModel from 'models/wallet/MainWalletModel'
import { getMainTokenForWalletByBlockchain } from 'redux/tokens/selectors'
import { BLOCKCHAIN_ETHEREUM } from 'dao/EthereumDAO'
import SendTokens from 'components/dashboard/SendTokens/SendTokens'
import DerivedWalletModel from 'models/wallet/DerivedWalletModel'
import './WalletWidgetMini.scss'
import { prefix } from './lang'
import SubIconForWallet from '../SubIconForWallet/SubIconForWallet'

function mapStateToProps (state, ownProps) {
  const wallet = getWallet(ownProps.blockchain, ownProps.address)(state)
  return {
    wallet,
    walletInfo: walletInfoSelector(wallet, ownProps.blockchain, ownProps.address, false, state),
    token: getMainTokenForWalletByBlockchain(ownProps.blockchain)(state),
    tokens: state.get(DUCK_TOKENS),
  }
}

function mapDispatchToProps (dispatch) {
  return {
    send: (tokenId, blockchain, address, wallet) => {
      dispatch(modalsOpen({
        component: SendTokens,
        props: {
          wallet,
          isModal: true,
          token: tokenId,
          blockchain,
          address,
        },
      }))
    },
    selectWallet: (blockchain, address) => dispatch(selectWallet(blockchain, address)),
  }
}

@connect(mapStateToProps, mapDispatchToProps)
export default class WalletWidgetMini extends PureComponent {
  static propTypes = {
    blockchain: PropTypes.string,
    wallet: PropTypes.oneOfType([
      PropTypes.instanceOf(MainWalletModel),
      PropTypes.instanceOf(MultisigWalletModel),
      PropTypes.instanceOf(DerivedWalletModel),
    ]),
    address: PropTypes.string,
    token: PropTypes.instanceOf(TokenModel),
    tokens: PropTypes.instanceOf(TokensCollection),
    walletInfo: PropTypes.shape({
      address: PropTypes.string,
      balance: PropTypes.number,
      tokens: PropTypes.array,
    }),
    send: PropTypes.func,
    selectWallet: PropTypes.func,
    showGroupTitle: PropTypes.bool,
  }

  handleSelectWallet = () => {
    const { address, blockchain } = this.props
    this.props.selectWallet(blockchain, address)
  }

  getWalletName = () => {
    const { wallet, blockchain, address } = this.props
    const name = wallet instanceof MainWalletModel ? wallet.name(blockchain, address) : wallet.name()
    if (name) {
      return name
    }

    let key = null
    if (this.isMy2FAWallet()) {
      key = 'twoFAWallet'
    } else if (this.isMySharedWallet()) {
      key = 'sharedWallet'
    } else if (this.isLockedWallet()) {
      key = 'lockedWallet'
    } else if (wallet instanceof DerivedWalletModel) {
      if (wallet.customTokens()) {
        key = 'customWallet'
      } else {
        key = 'additionalStandardWallet'
      }
    } else {
      key = 'standardWallet'
    }

    return <Translate value={`${prefix}.${key}`} />
  }

  isMySharedWallet = () => {
    return this.props.wallet.isMultisig() && !this.props.wallet.isTimeLocked() && !this.props.wallet.is2FA()
  }

  isMy2FAWallet = () => {
    return this.props.wallet.isMultisig() && this.props.wallet.is2FA()
  }

  isLockedWallet = () => {
    return this.props.wallet.isMultisig() && this.props.wallet.isTimeLocked()
  }

  render () {
    const { address, token, blockchain, walletInfo, wallet, showGroupTitle } = this.props

    if (!walletInfo || walletInfo.balance === null || !walletInfo.tokens.length > 0) {
      return null
    }

    const pendingslength = wallet.pendingTxList ? wallet.pendingTxList().size() : 0

    return (
      <div styleName='container'>
        {showGroupTitle && <h1 styleName='header-text' id={blockchain}><Translate value={`${prefix}.walletTitle`} title={blockchain} /></h1>}
        <div styleName='wallet-list-container'>
          <div styleName='wallet-container'>
            <div styleName='main-info'>
              <div styleName='token-container'>
                {blockchain === BLOCKCHAIN_ETHEREUM && <SubIconForWallet wallet={wallet} />}
                <div styleName='token-icon'>
                  <IPFSImage styleName='image' multihash={token.icon()} fallback={TOKEN_ICONS[token.symbol()]} />
                </div>
              </div>
              <div styleName='content-container'>
                <Link styleName='addressWrapper' href='' to='/wallet' onTouchTap={this.handleSelectWallet}>
                  <div styleName='address-title'>
                    <div>{this.getWalletName()}</div>
                    <span styleName='address-address'>{address}</span>
                  </div>
                </Link>
              </div>
            </div>
            {pendingslength > 0 && (
              <div styleName='additional-info'>
                <div styleName='pendings-container'>
                  <div styleName='pendings-icon'><Translate value={`${prefix}.pending`} count={pendingslength} /></div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }
}
