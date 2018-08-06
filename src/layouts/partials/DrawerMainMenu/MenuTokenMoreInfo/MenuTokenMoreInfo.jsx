/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { DUCK_MONITOR } from '@chronobank/login/redux/monitor/constants'
import { Link } from 'react-router'
import { CopyIcon, IPFSImage, QRIcon } from 'components'
import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { selectWallet } from '@chronobank/core/redux/wallet/actions'
import TokenModel from '@chronobank/core/models/tokens/TokenModel'
import { Translate } from 'react-redux-i18n'
import { IconButton } from '@material-ui/core'
import { TOKEN_ICONS } from 'assets'
import { PTWallet } from '@chronobank/core/redux/wallet/types'
import WalletName from 'components/wallet/WalletName/WalletName'
import walletLinkSvg from 'assets/img/icons/prev.svg'
import copySvg from 'assets/img/icons/copy.svg'
import qrSvg from 'assets/img/icons/qr.svg'
import { BLOCKCHAIN_ETHEREUM } from '@chronobank/core/dao/EthereumDAO'
import { NETWORK_STATUS_OFFLINE, NETWORK_STATUS_ONLINE, NETWORK_STATUS_UNKNOWN, SYNC_STATUS_SYNCED, SYNC_STATUS_SYNCING } from '@chronobank/login/network/MonitorService'
import { SIDES_TOGGLE_MAIN_MENU } from 'redux/sides/constants'
import { DUCK_SESSION } from '@chronobank/core/redux/session/constants'
import './MenuTokenMoreInfo.scss'
import { prefix } from './lang'
import { getSelectedToken, getSelectedWalletAddress, getWalletCompactWalletsList } from './selectors'

const makeMapStateToProps = () => {
  const getTokenFromState = getSelectedToken()
  const getAddressFromState = getSelectedWalletAddress()
  const getWallets = getWalletCompactWalletsList()
  const mapStateToProps = (ownState, ownProps) => {
    const monitor = ownState.get(DUCK_MONITOR)
    const { account } = ownState.get(DUCK_SESSION)
    return {
      networkStatus: monitor.network,
      syncStatus: monitor.sync,
      token: getTokenFromState(ownState, ownProps),
      walletAddress: getAddressFromState(ownState, ownProps),
      wallets: getWallets(ownState),
      account,
    }
  }
  return mapStateToProps
}

function mapDispatchToProps (dispatch) {
  return {
    onMainMenuClose: () => dispatch({ type: SIDES_TOGGLE_MAIN_MENU, mainMenuIsOpen: false }),
    selectWallet: (blockchain, address) => dispatch(selectWallet(blockchain, address)),
  }
}

@connect(makeMapStateToProps, mapDispatchToProps)
export default class MenuTokenMoreInfo extends PureComponent {
  static propTypes = {
    token: PropTypes.instanceOf(TokenModel),
    selectedToken: PropTypes.objectOf(PropTypes.string),
    walletAddress: PropTypes.string,
    wallets: PropTypes.arrayOf(PTWallet),
    networkStatus: PropTypes.shape({
      status: PropTypes.string,
    }),
    syncStatus: PropTypes.shape({
      status: PropTypes.string,
      progress: PropTypes.number,
    }),
    onProfileClose: PropTypes.func,
    onMainMenuClose: PropTypes.func,
    account: PropTypes.string,
    selectWallet: PropTypes.func,
  }

  handleClose = () => {
    this.props.onProfileClose()
  }

  handleSelectLink = (blockchain, address) => {
    this.props.onMainMenuClose()
    this.handleClose()
    this.props.selectWallet(blockchain, address)
  }

  renderWallet = (wallet) => {
    const { token } = this.props

    // if user not owner
    if (!token.blockchain() || token.blockchain() !== wallet.blockchain || !wallet.owners.includes(this.props.account)) {
      return null
    }

    return (
      <div styleName='walletIrem' key={wallet.address}>
        <Link to='/wallet' href styleName='walletTitle' onClick={() => this.handleSelectLink(wallet.blockchain, wallet.address)}>
          <div styleName='walletName'><WalletName wallet={wallet} /></div>
          <div styleName='walletAddress'>{wallet.address}</div>
          <div styleName='walletLink'>
            <img alt='' src={walletLinkSvg} />
          </div>
        </Link>

        <div styleName='action'>
          <CopyIcon value={wallet.address}>
            <div styleName='copyWrap'>
              <div styleName='actionIcon'>
                <img src={copySvg} alt='' />
              </div>
              <div styleName='actionTitle'>
                <Translate value={`${prefix}.copyAddress`} />
              </div>
            </div>
          </CopyIcon>
        </div>

        <div styleName='action'>
          <div styleName='actionIcon'>
            <img src={qrSvg} alt='' />
          </div>
          <div styleName='actionTitle'>
            <Translate value={`${prefix}.showQR`} />
          </div>
        </div>

      </div>
    )
  }

  renderStatus () {
    const { networkStatus, syncStatus } = this.props

    switch (networkStatus.status) {
      case NETWORK_STATUS_ONLINE: {
        switch (syncStatus.status) {
          case SYNC_STATUS_SYNCED:
            return (<div styleName='icon status-synced'><Translate value={`${prefix}.synced`} /></div>)
          case SYNC_STATUS_SYNCING:
          default:
            return (<div styleName='icon status-syncing'><Translate value={`${prefix}.syncing`} /></div>)
        }
      }
      case NETWORK_STATUS_OFFLINE:
        return (<div styleName='icon status-offline'><Translate value={`${prefix}.offline`} /></div>)
      case NETWORK_STATUS_UNKNOWN:
      default:
        return null
    }
  }

  render () {
    const { selectedToken, token, walletAddress, wallets } = this.props

    return (
      <div styleName='root'>
        <div styleName='content-part'>
          <div styleName='title'>
            <IPFSImage styleName='tokenIcon' multihash={token.icon()} fallback={TOKEN_ICONS[token.symbol()]} />
            <div styleName='titleText'>{token.name() || token.symbol() || <Translate value={`${prefix}.title`} />}</div>
            <div styleName='close' onClick={this.handleClose}>
              <IconButton>
                <i className='material-icons'>close</i>
              </IconButton>
            </div>
          </div>

          <div styleName='walletIrem'>
            <Link to='/wallet' styleName='walletTitle' onClick={() => {
              this.handleSelectLink(token.blockchain(), walletAddress)
            }}>
              <div styleName='walletName'><Translate value={`${prefix}.mainWalletTitle`} /></div>
              <div styleName='walletAddress'>{walletAddress}</div>
              <div styleName='walletLink'>
                <img alt='' src={walletLinkSvg} />
              </div>
            </Link>

            <div styleName='action'>
              <CopyIcon value={walletAddress}>
                <div styleName='copyWrap'>
                  <div styleName='actionIcon'>
                    <img src={copySvg} alt='' />
                  </div>
                  <div styleName='actionTitle'>
                    <Translate value={`${prefix}.copyAddress`} />
                  </div>
                </div>
              </CopyIcon>
            </div>

            <div styleName='action'>
              <QRIcon value={walletAddress}>
                <div styleName='copyWrap'>
                  <div styleName='actionIcon'>
                    <img src={qrSvg} alt='' />
                  </div>
                  <div styleName='actionTitle'>
                    <Translate value={`${prefix}.showQR`} />
                  </div>
                </div>
              </QRIcon>
            </div>
          </div>

          {wallets.map(this.renderWallet)}

          {selectedToken && selectedToken.blockchain === BLOCKCHAIN_ETHEREUM && (
            <div styleName='network'>
              <div styleName='networkTitle'>
                <Translate value={`${prefix}.networkTitle`} />
              </div>
              <div styleName='networkStatus'>
                {this.renderStatus()}
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }
}
