import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Link } from 'react-router'

import promisify from 'promisify-node-callback'
import QRCode from 'qrcode'

import { FontIcon, FlatButton, Popover } from 'material-ui'
import { IPFSImage, UpdateProfileDialog, TokenValue } from 'components'

import ls from 'utils/LocalStorage'
import Clipboard from 'utils/Clipboard'
import { getNetworkById } from 'network/settings'
import { logout } from 'redux/session/actions'
import { modalsOpen } from 'redux/modals/actions'

import styles from './styles'
import './HeaderPartial.scss'

export const menu = [
  // { key: "dashboard", title: 'Dashboard', icon: 'dashboard', path: '/markup/dashboard' },
  {key: 'wallet', title: 'ChronoBank.io Wallet', icon: 'account_balance_wallet', path: '/new/wallet'},
  // { key: "exchange", title: 'Exchange', icon: 'compare_arrows', path: '/markup/exchange' },
  // { key: "history", title: 'History', icon: 'history', path: '/markup/history' },
  // { key: "rewards", title: 'Rewards', icon: 'attach_money', path: '/markup/rewards' },
  {key: 'rewards', title: 'Rewards', icon: 'card_giftcard', path: '/rewards'}
]

// TODO: @ipavlenko: MINT-234 - Remove when icon property will be implemented
const ICON_OVERRIDES = {
  ETH: require('assets/img/icn-ethereum.svg'),
  TIME: require('assets/img/icn-time.svg')
}

@connect(mapStateToProps, mapDispatchToProps)
class HeaderPartial extends React.Component {

  static propTypes = {
    isCBE: PropTypes.bool,
    network: PropTypes.string,
    account: PropTypes.string,
    profile: PropTypes.object,
    tokens: PropTypes.object,
    isTokensLoaded: PropTypes.bool,

    handleLogout: PropTypes.func,
    handleProfileEdit: PropTypes.func
  }

  constructor (props) {
    super(props)

    this.menu = [
      ...menu,
      props.isCBE
        ? { key: 'cbeDashboard', title: 'CBE Dashboard', icon: 'dashboard', path: '/cbe' }
        : { key: 'oldInterface', title: 'Old Interface', icon: 'dashboard', path: '/profile' }
    ]

    this.state = {
      isProfileOpen: false,
      profileAnchorEl: null,
      isQROpen: false,
      qrData: null,
      qrAnchorEl: null
    }
  }

  render () {
    return (
      <div styleName='root'>
        <div styleName='left'>
          <div styleName='routes'>
            {this.menu.map((item) => (
              <FlatButton
                key={item.key}
                styleName='route'
                style={styles.header.route.style}
                labelStyle={styles.header.route.labelStyle}
                label={item.title}
                disabled={true}
                icon={<FontIcon className='material-icons'>{item.icon}</FontIcon>}
                containerElement={
                  <Link activeClassName={'active'} to={{pathname: item.path}} />
                }
              />
            ))}
          </div>
        </div>
        <div styleName='center'>
        </div>
        <div styleName='actions'>
          {/*
           TODO @bshevchenko
           <IconButton>
           <FontIcon className="material-icons">search</FontIcon>
           </IconButton>
           <IconButton>
           <FontIcon className="material-icons">notifications_active</FontIcon>
           </IconButton>
          */}
        </div>
        <div styleName='account'>
          <div styleName='info'>
            <span styleName='badge-green'>{this.props.network}</span>
            <span styleName='highlight0'>{this.props.profile.name() || 'Account Name'}</span>
          </div>
          <div styleName='extra'>
            <span styleName='highlight1'>{this.props.account}</span>
            <a styleName='micro' onTouchTap={(e) => this.handleQROpen(e)}>
              <i className='material-icons'>center_focus_weak</i>
            </a>
            <a styleName='micro' onTouchTap={() => this.handleCopyAddress()}>
              <i className='material-icons'>content_copy</i>
            </a>
            <Popover
              zDepth={3}
              open={this.state.isQROpen}
              anchorEl={this.state.qrAnchorEl}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              targetOrigin={{ horizontal: 'right', vertical: 'top' }}
              onRequestClose={() => this.handleQRClose()}
            >
              {this.renderQR()}
            </Popover>
          </div>
        </div>
        <div styleName='right'>
          <div styleName='icon' onTouchTap={(e) => this.handleProfileOpen(e)}>
            <IPFSImage styleName='content' multihash={this.props.profile.icon()} />
          </div>
          <Popover
            zDepth={3}
            open={this.state.isProfileOpen}
            anchorEl={this.state.profileAnchorEl}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            targetOrigin={{ horizontal: 'right', vertical: 'top' }}
            onRequestClose={() => this.handleProfileClose()}
          >
            {this.renderProfile()}
          </Popover>
        </div>
      </div>
    )
  }

  renderProfile () {

    const items = !this.props.isTokensLoaded
      ? []
      : this.props.tokens.entrySeq().toArray().map(([name, token]) => ({
        token,
        name
      })
    )

    return (
      <div styleName='profile'>
        <div styleName='profile-body'>
          <div styleName='body-avatar'>
            <div styleName='icon' onTouchTap={(e) => this.handleProfileOpen(e)}>
              <IPFSImage styleName='content' multihash={this.props.profile.icon()} />
            </div>
            <div styleName='network'>
              <span styleName='badge-green'>{this.props.network}</span>
            </div>
          </div>
          <div styleName='body-info'>
            <div styleName='info-account'>{this.props.profile.name()}</div>
            <div styleName='info-company'>{this.props.profile.company()}</div>
            <div styleName='info-address'>{this.props.account}</div>
            <div styleName='info-balances'>
              { items.map((item) => this.renderBalance(item)) }
            </div>
          </div>
        </div>
        <div styleName='profile-footer'>
          <FlatButton
            label='Edit Account'
            primary
            icon={<FontIcon className='material-icons'>edit</FontIcon>}
            onTouchTap={() => this.handleProfileEdit()}
          />
          <FlatButton
            label='Switch Account'
            primary
            icon={<FontIcon className='material-icons'>power_settings_new</FontIcon>}
             onTouchTap={() => this.props.handleLogout()}
          />
        </div>
      </div>
    )
  }

  renderBalance ({ token }) {

    const symbol = token.symbol().toUpperCase()

    return (
      <div styleName='balance' key={token.id()}>
        <div styleName='balance-icon'>
          <div styleName='icon'>
            <IPFSImage styleName='content' multihash={token.icon()} fallback={ICON_OVERRIDES[symbol]} />
          </div>
        </div>
        <div styleName='balance-info'>
          <TokenValue
            value={token.balance()}
            symbol={token.symbol()}
          />
        </div>
      </div>
    )
  }

  renderQR () {
    return (
      <img src={this.state.qrData} />
    )
  }

  handleCopyAddress() {
    Clipboard.copy(this.props.account)
  }

  handleProfileOpen (e) {
    e.preventDefault()
    this.setState({
      isProfileOpen: true,
      profileAnchorEl: e.currentTarget
    })
  }

  handleProfileClose () {
    this.setState({
      isProfileOpen: false,
      profileAnchorEl: null
    })
  }

  async handleQROpen (e) {
    e.preventDefault()
    this.setState({
      isQROpen: true,
      qrData: this.state.qrData || await promisify(QRCode.toDataURL)(this.props.account),
      qrAnchorEl: e.currentTarget
    })
  }

  handleQRClose () {
    this.setState({
      isQROpen: false,
      qrAnchorEl: null
    })
  }

  handleProfileEdit () {
    this.handleProfileClose()
    this.props.handleProfileEdit()
  }
}

function mapStateToProps (state) {
  const session = state.get('session')
  const wallet = state.get('wallet')
  return {
    account: session.account,
    profile: session.profile,
    isCBE: session.isCBE,
    network: getNetworkById(ls.getNetwork(), ls.getProvider(), true).name,
    isTokensLoaded: !wallet.tokensFetching,
    tokens: wallet.tokens
  }
}

function mapDispatchToProps (dispatch) {
  return {
    handleLogout: () => dispatch(logout()),
    handleProfileEdit: (data) => dispatch(modalsOpen({
      component: UpdateProfileDialog,
      data
    })),
  }
}

export default HeaderPartial
