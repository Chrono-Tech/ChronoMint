import React from 'react'
import { Link } from 'react-router'

import { FontIcon, IconButton, FlatButton, Avatar } from 'material-ui'

import styles from './styles'
import './HeaderPartial.scss'

export default class HeaderPartial extends React.Component {

  menu = [
    { key: "dashboard", title: 'Dashboard', icon: 'dashboard', path: '/markup/dashboard' },
    { key: "wallet", title: 'Wallet', icon: 'account_balance_wallet', path: '/markup/wallet' },
    { key: "exchange", title: 'Exchange', icon: 'compare_arrows', path: '/markup/exchange' },
    { key: "history", title: 'History', icon: 'history', path: '/markup/history' },
    { key: "rewards", title: 'Rewards', icon: 'attach_money', path: '/markup/rewards' },
    { key: "voting", title: 'Voting', icon: 'record_voice_over', path: '/markup/voting' }
  ]

  constructor(props) {
    super(props)
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
          <IconButton>
            <FontIcon className="material-icons">search</FontIcon>
          </IconButton>
          <IconButton>
            <FontIcon className="material-icons">notifications_active</FontIcon>
          </IconButton>
        </div>
        <div styleName="account">
          <div styleName="info">
            <span styleName="badgeGreen">Main</span>
            <span styleName="highlight0">Account Name</span>
          </div>
          <div styleName="extra">
            <span styleName="highlight1">0x9876f6...</span>
          </div>
        </div>
        <div styleName="right">
          <Avatar size={48} icon={<FontIcon className="material-icons">person</FontIcon>} />
          <IconButton>
            <FontIcon className="material-icons">more_vert</FontIcon>
          </IconButton>
        </div>
      </div>
    )
  }
}
