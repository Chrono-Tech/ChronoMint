import { DUCK_MONITOR } from '@chronobank/login/redux/monitor/actions'
import { Link } from 'react-router'
import { CopyIcon, IPFSImage, QRIcon } from 'components'
import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { getToken } from 'redux/locs/selectors'
import TokenModel from 'models/tokens/TokenModel'
import { Translate } from 'react-redux-i18n'
import { IconButton } from 'material-ui'
import { TOKEN_ICONS } from 'assets'
import { getWalletAddress } from 'redux/mainWallet/selectors'
import AddressModel from 'models/wallet/AddressModel'
import walletLinkSvg from 'assets/img/icons/prev.svg'
import copySvg from 'assets/img/icons/copy.svg'
import qrSvg from 'assets/img/icons/qr.svg'
import { DUCK_MULTISIG_WALLET } from 'redux/multisigWallet/actions'
import MultisigWalletCollection from 'models/wallet/MultisigWalletCollection'
import { BLOCKCHAIN_ETHEREUM } from 'dao/EthereumDAO'
import { NETWORK_STATUS_OFFLINE, NETWORK_STATUS_ONLINE, NETWORK_STATUS_UNKNOWN, SYNC_STATUS_SYNCED, SYNC_STATUS_SYNCING } from '@chronobank/login/network/MonitorService'
import { SIDES_TOGGLE_MAIN_MENU } from 'redux/sides/actions'
import './MenuTokenMoreInfo.scss'
import { prefix } from './lang'

export const MENU_TOKEN_MORE_INFO_PANEL_KEY = 'MenuTokenMoreInfo_panelKey'

function mapStateToProps (state, ownProps) {
  const multiSigWallet = state.get(DUCK_MULTISIG_WALLET)
  const monitor = state.get(DUCK_MONITOR)

  return {
    networkStatus: monitor.network,
    syncStatus: monitor.sync,
    token: getToken(ownProps.selectedToken ? ownProps.selectedToken.symbol : null)(state),
    walletAddress: getWalletAddress(ownProps.selectedToken ? ownProps.selectedToken.blockchain : null)(state),
    multiSigWallet,
  }
}

function mapDispatchToProps (dispatch) {
  return {
    onMainMenuClose: () => dispatch({ type: SIDES_TOGGLE_MAIN_MENU, mainMenuIsOpen: false }),
  }
}

@connect(mapStateToProps, mapDispatchToProps)
export default class MenuTokenMoreInfo extends PureComponent {
  static propTypes = {
    token: PropTypes.instanceOf(TokenModel),
    selectedToken: PropTypes.objectOf(PropTypes.string),
    walletAddress: PropTypes.instanceOf(AddressModel),
    multiSigWallet: PropTypes.instanceOf(MultisigWalletCollection),
    networkStatus: PropTypes.shape({
      status: PropTypes.string,
    }),
    syncStatus: PropTypes.shape({
      status: PropTypes.string,
      progress: PropTypes.number,
    }),
    onProfileClose: PropTypes.func,
    onMainMenuClose: PropTypes.func,
  }

  handleClose = () => {
    this.props.onProfileClose()
  }

  handleSelectLink = () => {
    this.props.onMainMenuClose()
    this.handleClose()
  }

  renderWallet = (wallet) => {
    return (
      <div styleName='walletIrem' key={wallet.address()}>
        <Link to='/wallet' href styleName='walletTitle' onTouchTap={this.handleSelectLink}>
          <div styleName='walletName'><Translate value={`${prefix}.multisignatureWallet`} /></div>
          <div styleName='walletAddress'>{wallet.address()}</div>
          <div styleName='walletLink'>
            <img alt='' src={walletLinkSvg} />
          </div>
        </Link>

        <div styleName='action'>
          <CopyIcon value={wallet.address()}>
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
    const { selectedToken, token, walletAddress, multiSigWallet } = this.props

    return (
      <div styleName='root'>
        <div styleName='content-part'>
          <div styleName='title'>
            <IPFSImage styleName='tokenIcon' multihash={token.icon()} fallback={TOKEN_ICONS[ token.symbol() ]} />
            <div styleName='titleText'>{token.name() || token.symbol() || <Translate value={`${prefix}.title`} />}</div>
            <div styleName='close' onTouchTap={this.handleClose}>
              <IconButton>
                <i className='material-icons'>close</i>
              </IconButton>
            </div>
          </div>

          <div styleName='walletIrem'>
            <Link to='/wallet' href styleName='walletTitle' onTouchTap={this.handleSelectLink}>
              <div styleName='walletName'><Translate value={`${prefix}.mainWalletTitle`} /></div>
              <div styleName='walletAddress'>{walletAddress.address()}</div>
              <div styleName='walletLink'>
                <img alt='' src={walletLinkSvg} />
              </div>
            </Link>

            <div styleName='action'>
              <CopyIcon value={walletAddress.address()}>
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
              <QRIcon value={walletAddress.address()}>
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

          {selectedToken && selectedToken.blockchain === BLOCKCHAIN_ETHEREUM && multiSigWallet.items().map(this.renderWallet)}

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
