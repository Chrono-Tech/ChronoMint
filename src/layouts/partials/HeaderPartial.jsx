import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Link } from 'react-router'

import { FontIcon, FlatButton, Popover, IconButton } from 'material-ui'
import { IPFSImage, UpdateProfileDialog, TokenValue, CopyIcon, QRIcon } from 'components'

import ls from 'utils/LocalStorage'
import { getNetworkById } from 'network/settings'
import { logout } from 'redux/session/actions'
import { modalsOpen } from 'redux/modals/actions'
import { drawerToggle } from 'redux/drawer/actions'
import menu from 'menu'

import styles from './styles'
import { Translate } from 'react-redux-i18n'
import './HeaderPartial.scss'

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
    handleProfileEdit: PropTypes.func,
    handleDrawerToggle: PropTypes.func
  }

  constructor (props) {
    super(props)
    this.state = {
      isProfileOpen: false,
      profileAnchorEl: null
    }
  }

  render () {
    return (
      <div styleName='root'>
        <div styleName='menu' className={this.props.isCBE ? 'menu-cbe' : null}>
          <IconButton onTouchTap={this.props.handleDrawerToggle}>
            <FontIcon className='material-icons'>menu</FontIcon>
          </IconButton>
        </div>
        <div styleName='left'>
          <div styleName='routes'>
            {menu.user.map((item) => (
              <FlatButton
                key={item.key}
                styleName='route'
                style={styles.header.route.style}
                labelStyle={item.disabled ? styles.header.route.labelStyleDisabled : styles.header.route.labelStyle}
                label={<Translate value={item.title} />}
                disabled={item.disabled}
                icon={<FontIcon className='material-icons' style={item.disabled ? styles.header.route.iconStyleDisabled : null}>{item.icon}</FontIcon>}
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
            <span styleName='highlight0'>{this.props.profile.name() || 'Your Name'}</span>
          </div>
          <div styleName='extra'>
            <span styleName='highlight1'>{this.props.account}</span>
            <QRIcon value={this.props.account} />
            <CopyIcon value={this.props.account} />
          </div>
        </div>
        <div styleName='right'>
          <div styleName='icon' onTouchTap={(e) => this.handleProfileOpen(e)}>
            <IPFSImage
              styleName='content'
              multihash={this.props.profile.icon()}
              icon={(
                <FontIcon style={{fontSize: 54}} color='white' className='material-icons'>account_circle</FontIcon>)}
            />
          </div>
          <Popover
            ref={(el) => { this.profilePopover = el }}
            className='popover'
            zDepth={3}
            open={this.state.isProfileOpen}
            anchorEl={this.state.profileAnchorEl}
            anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}
            targetOrigin={{horizontal: 'right', vertical: 'top'}}
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
      : this.props.tokens.entrySeq().toArray().map(([name, token]) => ({token, name}))

    return (
      <div styleName='profile'>
        <div styleName='profile-body'>
          <div styleName='body-avatar'>
            <div styleName='icon'>
              <IPFSImage
                styleName='content'
                multihash={this.props.profile.icon()}
                icon={<FontIcon style={{fontSize: 96, cursor: 'default'}} color='white'
                                className='material-icons'>account_circle</FontIcon>}
              />
            </div>
          </div>
          <div styleName='body-info'>
            <div styleName='badge-green'>{this.props.network}</div>
            <div styleName='info-account'>{this.props.profile.name()}</div>
            <div styleName='info-company'>{this.props.profile.company()}</div>
            <div styleName='info-address'>{this.props.account}</div>
            <div styleName='info-micros'>
              <QRIcon value={this.props.account} />
              <CopyIcon value={this.props.account} onModalOpen={() => { this.profilePopover.componentClickAway() }} />
            </div>
            <div styleName='info-balances'>
              {items.map((item) => this.renderBalance(item))}
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
            label='LOGOUT'
            primary
            icon={<FontIcon className='material-icons'>power_settings_new</FontIcon>}
            onTouchTap={() => this.props.handleLogout()}
          />
        </div>
      </div>
    )
  }

  renderBalance ({token}) {

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
    network: getNetworkById(ls.getNetwork(), ls.getProvider(), true).name,
    isTokensLoaded: !wallet.tokensFetching,
    isCBE: state.get('session').isCBE,
    tokens: wallet.tokens
  }
}

function mapDispatchToProps (dispatch) {
  return {
    handleLogout: () => dispatch(logout()),
    handleDrawerToggle: () => dispatch(drawerToggle()),
    handleProfileEdit: (data) => dispatch(modalsOpen({
      component: UpdateProfileDialog,
      data
    }))
  }
}

export default HeaderPartial
