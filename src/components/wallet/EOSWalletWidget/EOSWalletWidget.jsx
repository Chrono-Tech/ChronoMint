/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import PropTypes from 'prop-types'
import { Link } from 'react-router'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { selectWallet } from '@chronobank/core/redux/wallet/actions'
import { modalsOpen } from '@chronobank/core/redux/modals/actions'
import { Translate } from 'react-redux-i18n'
import { TOKEN_ICONS } from 'assets'
import Button from 'components/common/ui/Button/Button'
import IPFSImage from 'components/common/IPFSImage/IPFSImage'
import { isBTCLikeBlockchain } from '@chronobank/core/redux/tokens/selectors'
import { BLOCKCHAIN_ETHEREUM } from '@chronobank/core/dao/constants'
import WalletModel from '@chronobank/core/models/wallet/WalletModel'
import MultisigEthWalletModel from '@chronobank/core/models/wallet/MultisigEthWalletModel'
import { EOS } from '@chronobank/core/redux/eos/constants'
import { EOSPendingSelector, getEOSWallet } from '@chronobank/core/redux/eos/selectors/mainSelectors'
import './EOSWalletWidget.scss'
import { prefix } from './lang'
import SubIconForWallet from '../SubIconForWallet/SubIconForWallet'
import EOSWalletTokensList from './EOSWalletTokensList'
import WalletName from '../WalletName/WalletName'
import BalanceSubscription from '../../micros/BalanceSubscription/BalanceSubscription'
import EOSWalletMainCoinBalance from './EOSWalletMainCoinBalance'

function makeMapStateToProps (state, ownProps) {
  const getWallet = getEOSWallet(`${ownProps.blockchain}-${ownProps.address}`)
  const getTransactions = EOSPendingSelector()

  const mapStateToProps = (ownState) => {
    return {
      wallet: getWallet(ownState),
      pendingTransactions: getTransactions(ownState), // TODO check this props
    }
  }
  return mapStateToProps
}

function mapDispatchToProps (dispatch) {
  return {
    send: (wallet) => {
      dispatch(modalsOpen({
        componentName: 'SendTokens',
        props: {
          wallet,
          isModal: true,
        },
      }))
    },
    receive: (wallet) => dispatch(modalsOpen({
      componentName: 'ReceiveTokenModal',
      props: {
        wallet,
      },
    })),
    deposit: (props) => dispatch(modalsOpen({
      componentName: 'DepositTokensModal',
      props,
    })),
    selectWallet: (blockchain, address) => dispatch(selectWallet(blockchain, address)),
    setWalletName: (wallet, blockchain, address) => dispatch(modalsOpen({
      componentName: 'WalletSettingsForm',
      props: {
        wallet,
        blockchain,
        address,
      },
    })),
  }
}

@connect(makeMapStateToProps, mapDispatchToProps)
export default class EOSWalletWidget extends PureComponent {
  static propTypes = {
    wallet: PropTypes.oneOfType([PropTypes.instanceOf(WalletModel), PropTypes.instanceOf(MultisigEthWalletModel)]),
    send: PropTypes.func,
    setWalletName: PropTypes.func,
    receive: PropTypes.func,
    deposit: PropTypes.func,
    selectWallet: PropTypes.func,
  }

  handleSend = (wallet) => () => {
    this.props.send(wallet)
  }

  handleReceive = () => {
    this.props.receive(this.props.wallet)
  }

  handleSelectWallet = () => {
    const { wallet } = this.props
    this.props.selectWallet(wallet.blockchain, wallet.address)
  }

  handleOpenSettings = () => {
    this.props.setWalletName(this.props.wallet)
  }

  renderLastIncomingIcon = () => {
    if (!this.props.pendingTransactions.length || !isBTCLikeBlockchain(this.props.blockchain)) {
      return null
    }

    let incoming = null
    this.props.pendingTransactions.forEach((t) => {
      if (!incoming && t.from() !== this.props.address && t.confirmations() < 4) {
        incoming = t
      }
    })

    if (!incoming) {
      return null
    }

    return (
      <div styleName='receive-container'>
        <div styleName='receive-icon' className='chronobank-icon'>{'circle-' + incoming.confirmations()}</div>
      </div>)
  }

  renderLastSendingIcon = () => {
    if (!this.props.pendingTransactions.length || !isBTCLikeBlockchain(this.props.blockchain)) {
      return null
    }

    let sending = null
    this.props.pendingTransactions.forEach((t) => {

      if (!sending && t.from() === this.props.address && t.confirmations() < 4) {
        sending = t
      }
    })

    if (!sending) {
      return null
    }

    return (
      <div styleName='send-container'>
        <div styleName='send-icon' className='chronobank-icon'>{'circle-' + sending.confirmations()}</div>
      </div>)
  }

  render () {
    const { wallet } = this.props
    const isBalancesLoaded = Object.values(wallet.balances).length

    return (
      <BalanceSubscription wallet={wallet}>
        <div styleName='root'>
          <div styleName='wallet-container'>
            {wallet.pendingCount > 0 && (
              <div styleName='pendings-container'>
                <div styleName='pendings-icon'><Translate value={`${prefix}.pending`} count={wallet.pendingCount} /></div>
              </div>
            )}
            {this.renderLastIncomingIcon()}
            {this.renderLastSendingIcon()}
            <div styleName='settings-container'>
              <button styleName='settings-icon' className='chronobank-icon' onClick={this.handleOpenSettings}>settings</button>
            </div>
            <div styleName='token-container'>
              {wallet.blockchain === BLOCKCHAIN_ETHEREUM && <SubIconForWallet wallet={wallet} />}
              <div styleName='token-icon'>
                <IPFSImage styleName='image' fallback={TOKEN_ICONS[EOS] || TOKEN_ICONS.DEFAULT} />
              </div>
            </div>
            <div styleName='content-container'>
              <Link styleName='addressWrapper' href='' to='/wallet' onClick={this.handleSelectWallet}>
                <div styleName='address-title'>
                  <h3><WalletName wallet={wallet} /></h3>
                  <span styleName='address-address'>{wallet.address}</span>
                </div>

                {isBalancesLoaded > 0
                  ? <EOSWalletMainCoinBalance wallet={wallet} />
                  : (<span styleName='noToken'> <Translate value={`${prefix}.tokenNotAvailable`} /> </span>)}
              </Link>

              <EOSWalletTokensList wallet={wallet} />

              <div styleName='actions-container'>
                <div styleName='action'>
                  <Button
                    disabled={!isBalancesLoaded}
                    type='submit'
                    label={<Translate value={`${prefix}.sendButton`} />}
                    onClick={this.handleSend(wallet)}
                  />
                </div>
                <div styleName='action'>
                  <Button
                    disabled={!isBalancesLoaded}
                    type='submit'
                    label={<Translate value={`${prefix}.receiveButton`} />}
                    onClick={this.handleReceive}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </BalanceSubscription>
    )
  }
}
