import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'

import { FontIcon, IconButton, FlatButton } from 'material-ui'

import ls from '../../utils/LocalStorage'
import { getNetworkById } from '../../network/settings'
import { logout } from '../../redux/session/actions'

import styles from './styles'
import './HeaderPartial.scss'

const mapStateToProps = (state) => {
  const session = state.get('session')
  return {
    account: session.account,
    isCBE: session.isCBE,
    network: getNetworkById(ls.getNetwork(), ls.getProvider(), true).name
  }
}

const mapDispatchToProps = (dispatch) => ({
  handleLogout: () => dispatch(logout())
})

@connect(mapStateToProps, mapDispatchToProps)
class HeaderPartial extends React.Component {

  menu = [
    // { key: "dashboard", title: 'Dashboard', icon: 'dashboard', path: '/markup/dashboard' },
    { key: 'wallet', title: 'Wallet', icon: 'account_balance_wallet', path: '/new/wallet' },
    // { key: "exchange", title: 'Exchange', icon: 'compare_arrows', path: '/markup/exchange' },
    // { key: "history", title: 'History', icon: 'history', path: '/markup/history' },
    // { key: "rewards", title: 'Rewards', icon: 'attach_money', path: '/markup/rewards' },
    // { key: "voting", title: 'Voting', icon: 'record_voice_over', path: '/markup/voting' }
  ]

  constructor(props) {
    super(props)

    if (props.isCBE) {
      this.menu.push({key: 'oldInterface', title: 'Old Interface', icon: 'dashboard', path: '/cbe'})
    }
  }

  render() {
    return (
      <div styleName="root">
        <div styleName="left">
          <div styleName="routes">
            { this.menu.map((item) => (
              <FlatButton
                key={item.key}
                styleName="route"
                style={styles.header.route.style}
                labelStyle={styles.header.route.labelStyle}
                label={item.title}
                disabled={true}
                icon={<FontIcon className="material-icons">{item.icon}</FontIcon>}
                containerElement={
                  <Link activeClassName={'active'} to={{ pathname: item.path }} />
                }
              />
            )) }
          </div>
        </div>
        <div styleName="center">

        </div>
        <div styleName="actions">
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
        <div styleName="account">
          <div styleName="info">
            <span styleName="badgeGreen">{this.props.network}</span>
            <span styleName="highlight0">Account Name</span>
          </div>
          <div styleName="extra">
            <span styleName="highlight1">{this.props.account}</span>
          </div>
        </div>
        <div styleName="right">
          {/* TODO @bshevchenko: <Avatar size={48} icon={<FontIcon className="material-icons">person</FontIcon>} />*/}
          {/* TODO @bshevchenko: <IconButton>
            <FontIcon className="material-icons">more_vert</FontIcon>
          </IconButton>
          */}
          <IconButton onTouchTap={this.props.handleLogout}>
            <FontIcon className="material-icons">power_settings_new</FontIcon>
          </IconButton>
        </div>
      </div>
    )
  }
}

export default HeaderPartial
