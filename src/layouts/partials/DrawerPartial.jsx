import React from 'react'

import { List, ListItem, IconButton, FontIcon } from 'material-ui'

import styles from './styles'
import './DrawerPartial.scss'

export default class DrawerPartial extends React.Component {

  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div styleName="root">
        <div styleName="content">
          <div styleName="menu">
            <IconButton>
              <FontIcon className="material-icons">menu</FontIcon>
            </IconButton>
          </div>
          <List>
            <ListItem styleName="item" style={styles.drawer.itemActive.style} primaryText="Dashboard" leftIcon={
              <FontIcon style={styles.drawer.itemActive.iconStyle} className='material-icons'>dashboard</FontIcon>
            } />
            <ListItem styleName="item" style={styles.drawer.item.style} primaryText="Wallet" leftIcon={
              <FontIcon style={styles.drawer.item.iconStyle} className='material-icons'>account_balance_wallet</FontIcon>
            } />
            <ListItem styleName="item" style={styles.drawer.item.style} primaryText="Exchange" leftIcon={
              <FontIcon style={styles.drawer.item.iconStyle} className='material-icons'>compare_arrows</FontIcon>
            } />
            <ListItem styleName="item" style={styles.drawer.item.style} primaryText="History" leftIcon={
              <FontIcon style={styles.drawer.item.iconStyle} className='material-icons'>history</FontIcon>
            } />
            <ListItem styleName="item" style={styles.drawer.item.style} primaryText="Rewards" leftIcon={
              <FontIcon style={styles.drawer.item.iconStyle} className='material-icons'>attach_money</FontIcon>
            } />
            <ListItem styleName="item" style={styles.drawer.item.style} primaryText="Voting" leftIcon={
              <FontIcon style={styles.drawer.item.iconStyle} className='material-icons'>record_voice_over</FontIcon>
            } />
          </List>
        </div>
      </div>
    )
  }
}
