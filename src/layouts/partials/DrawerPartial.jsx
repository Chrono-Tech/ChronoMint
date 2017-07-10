import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import { connect } from 'react-redux'
import { List, ListItem, IconButton, FontIcon } from 'material-ui'
import styles from './styles'
import { logout } from 'redux/session/actions'
import { drawerToggle } from 'redux/drawer/actions'
import { Link } from 'react-router'
import { Translate } from 'react-redux-i18n'
import './DrawerPartial.scss'

@connect(mapStateToProps, mapDispatchToProps)
export default class DrawerPartial extends React.Component {

  static propTypes = {
    menu: PropTypes.object,
    isCBE: PropTypes.bool,
    isDrawerOpen: PropTypes.bool,
    handleDrawerToggle: PropTypes.func
  }

  constructor (props) {
    super(props)

    this.state = {
      isOpened: false
    }
  }

  render () {
    return (
      <div styleName='root' className={classnames(this.props.isCBE ? 'root-cbe' : null, this.props.isDrawerOpen ? 'root-open' : null)}>
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
          {!this.props.menu.user ? null : (
            <List styleName='menu-user'>
              {this.props.menu.user.map(item => this.renderItem(item))}
            </List>
          )}
          {!this.props.isCBE ? null : (
            <List styleName='menu-cbe'>
              {this.props.menu.cbe.map(item => this.renderItem(item))}
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
        style={styles.drawer.item.style}
        innerDivStyle={styles.drawer.item.innerDivStyle}
        primaryText={<Translate value={item.title} />}
        leftIcon={
          <FontIcon
            style={styles.drawer.item.iconStyle}
            className='material-icons'>{item.icon}</FontIcon>
        }
        containerElement={
          <Link styleName='item' activeClassName={'drawer-item-active'} to={{pathname: item.path}} />
        }
      />
    )
  }
}

function mapStateToProps (state) {
  return {
    isDrawerOpen: state.get('drawer').isOpen,
    isCBE: state.get('session').isCBE
  }
}

function mapDispatchToProps (dispatch) {
  return {
    handleDrawerToggle: () => dispatch(drawerToggle()),
    handleLogout: () => dispatch(logout())
  }
}
