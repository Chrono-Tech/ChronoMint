/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { Link } from 'react-router-dom'
import { List, ListItem, IconButton } from '@material-ui/core'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { Translate } from 'react-redux-i18n'
import classnames from 'classnames'
import { connect } from 'react-redux'
import menu from 'menu'
import { drawerToggle, drawerHide } from 'redux/drawer/actions'
import { logoutAndNavigateToRoot } from 'redux/ui/thunks'
import styles from '../styles'

import './DrawerPartial.scss'

@connect(mapStateToProps, mapDispatchToProps)
export default class DrawerPartial extends PureComponent {
  static propTypes = {
    isDrawerOpen: PropTypes.bool,
    isCBE: PropTypes.bool,
    handleDrawerToggle: PropTypes.func,
    handleDrawerHide: PropTypes.func,
  }

  renderItem (item) {
    return (
      <ListItem
        key={item.key}
        style={item.disabled ? styles.drawer.item.styleDisabled : styles.drawer.item.style}
        innerDivStyle={styles.drawer.item.innerDivStyle}
        disabled={item.disabled}
        primaryText={<Translate value={item.title} />}
        onClick={this.props.handleDrawerHide}
        leftIcon={
          <i
            style={item.disabled ? styles.drawer.item.iconStyleDisabled : styles.drawer.item.iconStyle}
            className='material-icons'
          >{item.icon}
          </i>
        }
        containerElement={!item.disabled
          ? <Link
            styleName='item'
            activeclassname='drawer-item-active'
            to={{ pathname: item.path }}
          />
          : <div />
        }
      />
    )
  }

  render () {
    return (
      <div
        styleName='root'
        className={classnames(this.props.isCBE ? 'root-cbe' : null, this.props.isDrawerOpen ? 'root-open' : null)}
      >
        <div
          styleName='backdrop'
          onClick={this.props.handleDrawerToggle}
        />
        <div styleName='content'>
          <div styleName='menu'>
            <IconButton onClick={this.props.handleDrawerToggle}>
              <i className='material-icons'>menu</i>
            </IconButton>
          </div>
          {!menu.user ? null : (
            <List styleName='menu-user'>
              {menu.user.map((item) => this.renderItem(item))}
            </List>
          )}
          {!this.props.isCBE ? null : (
            <List styleName='menu-cbe'>
              {menu.cbe.map((item) => this.renderItem(item))}
            </List>
          )}
        </div>
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {
    isCBE: state.get('session').isCBE,
    isDrawerOpen: state.get('drawer').isOpen,
  }
}

function mapDispatchToProps (dispatch) {
  return {
    handleDrawerToggle: () => dispatch(drawerToggle()),
    handleDrawerHide: () => dispatch(drawerHide()),
    handleLogout: () => dispatch(logoutAndNavigateToRoot()),
  }
}
