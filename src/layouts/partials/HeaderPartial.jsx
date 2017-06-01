import React from 'react'

import { FontIcon, IconButton, FlatButton, Avatar } from 'material-ui'

import styles from './styles'
import './HeaderPartial.scss'

export default class HeaderPartial extends React.Component {

  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div styleName="root">
        <div styleName="left">
          <div styleName="menu">
            <IconButton>
              <FontIcon className="material-icons">menu</FontIcon>
            </IconButton>
          </div>
          <div styleName="routes">
            <FlatButton styleName="route" style={styles.header.route.style} labelStyle={styles.header.route.labelStyle}
              label="Dashboard" icon={<FontIcon className="material-icons">dashboard</FontIcon>} />
            <FlatButton styleName="route" style={styles.header.route.style} labelStyle={styles.header.route.labelStyle}
              label="Wallet" icon={<FontIcon className="material-icons">account_balance_wallet</FontIcon>} />
            <FlatButton styleName="route" style={styles.header.route.style} labelStyle={styles.header.route.labelStyle}
              label="Exchange" icon={<FontIcon className="material-icons">compare_arrows</FontIcon>} />
            <FlatButton styleName="route" style={styles.header.route.style} labelStyle={styles.header.route.labelStyle}
              label="History" icon={<FontIcon className="material-icons">history</FontIcon>} />
            <FlatButton styleName="route" style={styles.header.route.style} labelStyle={styles.header.route.labelStyle}
              label="Rewards" icon={<FontIcon className="material-icons">attach_money</FontIcon>} />
            <FlatButton styleName="route" style={styles.header.route.style} labelStyle={styles.header.route.labelStyle}
              label="Voting" icon={<FontIcon className="material-icons">record_voice_over</FontIcon>} />
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
            <span className="badge badge-green">Main</span>
            <span className="highlight highlight-primary-0">Account Name</span>
          </div>
          <div styleName="extra">
            <span className="highlight highlight-primary-1">0x9876f6...</span>
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
