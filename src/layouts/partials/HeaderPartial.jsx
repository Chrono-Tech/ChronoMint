import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Link } from 'react-router'

import { FontIcon, FlatButton, Popover } from 'material-ui'
import { IPFSImage, UpdateProfileDialog } from 'components'

import ls from 'utils/LocalStorage'
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

@connect(mapStateToProps, mapDispatchToProps)
class HeaderPartial extends React.Component {

  static propTypes = {
    isCBE: PropTypes.bool,
    network: PropTypes.string,
    account: PropTypes.string,
    profile: PropTypes.object,

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
      profileAnchorEl: null
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
            <span styleName='badgeGreen'>{this.props.network}</span>
            <span styleName='highlight0'>Account Name</span>
          </div>
          <div styleName='extra'>
            <span styleName='highlight1'>{this.props.account}</span>
          </div>
        </div>
        <div styleName='right'>
          <div styleName='icon' onTouchTap={(e) => this.handleProfileOpen(e)}>
            <IPFSImage styleName='content' multihash={this.props.profile.icon()} />
          </div>
          <Popover
            zDepth={2}
            open={this.state.isProfileOpen}
            anchorEl={this.state.profileAnchorEl}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            targetOrigin={{ horizontal: 'right', vertical: 'top' }}
            onRequestClose={() => this.handleProfileClose()}
          >
            <div styleName='profile'>
              <div styleName='profile-body'>
                <div styleName='body-avatar'>
                  <div styleName='icon' onTouchTap={(e) => this.handleProfileOpen(e)}>
                    <IPFSImage styleName='content' multihash={this.props.profile.icon()} />
                  </div>
                </div>
                <div styleName='body-info'>
                  <div styleName='info-account'>
                  </div>
                  <div styleName='info-company'>
                  </div>
                  <div styleName='info-address'>
                  </div>
                  <div styleName='info-balances'>
                  </div>
                </div>
              </div>
              <div styleName='profile-footer'>
                <FlatButton
                  label='Edit Account'
                  primary
                  icon={<FontIcon className='material-icons'>edit</FontIcon>}
                  onTouchTap={() => this.props.handleProfileEdit()}
                />
                <FlatButton
                  label='Switch Account'
                  primary
                  icon={<FontIcon className='material-icons'>power_settings_new</FontIcon>}
                   onTouchTap={() => this.props.handleLogout()}
                />
              </div>
            </div>
          </Popover>
        </div>
      </div>
    )
  }

  handleProfileOpen(e) {
    e.preventDefault()
    this.setState({
      isProfileOpen: true,
      profileAnchorEl: e.currentTarget
    })
  }

  handleProfileClose() {
    this.setState({
      isProfileOpen: false,
      profileAnchorEl: null
    })
  }
}

function mapStateToProps (state) {
  const session = state.get('session')
  return {
    account: session.account,
    profile: session.profile,
    isCBE: session.isCBE,
    network: getNetworkById(ls.getNetwork(), ls.getProvider(), true).name
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
