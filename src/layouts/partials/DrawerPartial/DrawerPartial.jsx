import { Link } from 'react-router'
import { List, ListItem, IconButton, FontIcon } from 'material-ui'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { Translate } from 'react-redux-i18n'
import classnames from 'classnames'
import { connect } from 'react-redux'
import menu from 'menu'
import { drawerToggle, drawerHide } from 'redux/drawer/actions'
import { logout } from 'redux/session/actions'
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

  render () {
    return (
      <div
        styleName='root'
        className={classnames(this.props.isCBE ? 'root-cbe' : null, this.props.isDrawerOpen ? 'root-open' : null)}
      >
        <div
          styleName='backdrop'
          onTouchTap={this.props.handleDrawerToggle}
        />
        <div styleName='content'>
          <div styleName='menu'>
            <IconButton onTouchTap={this.props.handleDrawerToggle}>
              <FontIcon className='material-icons'>menu</FontIcon>
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

  renderItem (item) {
    return (
      <ListItem
        key={item.key}
        style={item.disabled ? styles.drawer.item.styleDisabled : styles.drawer.item.style}
        innerDivStyle={styles.drawer.item.innerDivStyle}
        disabled={item.disabled}
        primaryText={<Translate value={item.title} />}
        onTouchTap={this.props.handleDrawerHide}
        leftIcon={
          <FontIcon
            style={item.disabled ? styles.drawer.item.iconStyleDisabled : styles.drawer.item.iconStyle}
            className='material-icons'
          >{item.icon}
          </FontIcon>
        }
        containerElement={!item.disabled
          ? <Link
            styleName='item'
            activeClassName='drawer-item-active'
            to={{ pathname: item.path }}
          />
          : <div />
        }
      />
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
    handleLogout: () => dispatch(logout()),
  }
}
