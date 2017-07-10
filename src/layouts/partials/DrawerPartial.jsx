import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { List, ListItem, IconButton, FontIcon } from 'material-ui'
import { menu } from './HeaderPartial'
import styles from './styles'
import { logout } from 'redux/session/actions'
import { drawerToggle } from 'redux/drawer/actions'
import { Link } from 'react-router'
import { Translate } from 'react-redux-i18n'
import './DrawerPartial.scss'

@connect(mapStateToProps, mapDispatchToProps)
export default class DrawerPartial extends React.Component {

  static propTypes = {
    isCBE: PropTypes.bool,
    isDrawerOpen: PropTypes.bool,

    handleDrawerToggle: PropTypes.func
  }

  constructor (props) {
    super(props)
    this.menu = [...menu]

    this.menu = [
      ...menu,
      props.isCBE
        ? {key: 'cbeSettings', title: 'nav.cbeSettings', icon: 'settings', path: '/cbe/settings'}
        : {key: 'oldInterface', title: 'nav.oldInterface', icon: 'dashboard', path: '/profile'}
    ]

    this.state = {
      isOpened: false
    }
  }

  render () {
    return (
      <div styleName={`root ${this.props.isDrawerOpen ? 'open' : ''}`}>
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
          <List>
            {this.menu.map(item => (
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
            ))}
          </List>
        </div>
      </div>
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
