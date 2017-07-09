// TODO MINT-224 New Drawer Menu
/* eslint-disable */
import React from 'react'
import { connect } from 'react-redux'
import { List, ListItem, IconButton, FontIcon } from 'material-ui'
import { menu } from './HeaderPartial'
import styles from './styles'
import { logout } from '../../redux/session/actions'
import { Link } from 'react-router'
import { Translate } from 'react-redux-i18n'
import './DrawerPartial.scss'

const mapStateToProps = (state) => ({
  isCBE: state.get('session').isCBE
})

const mapDispatchToProps = (dispatch) => ({
  handleLogout: () => dispatch(logout())
})

@connect(mapStateToProps, mapDispatchToProps)
export default class DrawerPartial extends React.Component {

  constructor (props) {
    super(props)
    this.menu = [...menu]

    if (props.isCBE) {
      this.menu.push({key: 'cbeSettings', title: 'nav.cbeSettings', icon: 'settings', path: '/cbe/settings'})
    } else {
      this.menu.push({key: 'oldInterface', title: 'nav.oldInterface', icon: 'dashboard', path: '/profile'})
    }

    this.state = {
      isOpened: false
    }
  }

  handleClick = () => {
    this.setState({isOpened: !this.state.isOpened})
  }

  render () {
    return (
      <div styleName={`root ${this.state.isOpened ? 'opened' : 'closed'}`}>
        <div
          styleName='backdrop'
          onTouchTap={this.handleClick}
        />
        <div styleName='content'>
          <div styleName='menu'>
            <IconButton onTouchTap={this.handleClick}>
              <FontIcon className='material-icons'>menu</FontIcon>
            </IconButton>
          </div>
          <List>
            {this.menu.map(item => (
              <ListItem
                key={item.key}
                styleName='item'
                style={styles.drawer.item.style}
                primaryText={<Translate value={item.title} />}
                leftIcon={
                  <FontIcon
                    style={styles.drawer.item.iconStyle}
                    className='material-icons'>{item.icon}</FontIcon>
                }
                containerElement={
                  <Link activeClassName={'drawer-item-active'} to={{pathname: item.path}} />
                }
              />
            ))}
          </List>
        </div>
      </div>
    )
  }
}
